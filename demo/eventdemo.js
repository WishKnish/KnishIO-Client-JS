class KnishIOClientFactory {
  uri = null
  cellSlug = null

  constructor (uri, cellSlug) {
    this.uri = uri
    this.cellSlug = cellSlug
  }

  /**
   * Creates a new instance of KnishIOClient and authenticates
   * it using the user's device fingerprint.
   *
   * @returns {Promise<KnishIOClient>} - The created KnishIOClient instance.
   */
  makeClient () {
    const client = new KnishIO.KnishIOClient({
      uri: this.uri,
      cellSlug: this.cellSlug
    })

    const fingerprint = client.getFingerprint()
    const secret = KnishIO.generateSecret(fingerprint)
    return client.requestAuthToken({
      secret
    }).then(() => {
      return client
    })
  }
}

class KnishIOEventFactory {
  metaType = null
  client = null
  hostMeta = {}

  /**
   * Class constructor injecting a working KnishIOClient instance for future use.
   *
   * @param {KnishIOClient} client
   */
  constructor (client, metaType) {
    if (client.getAuthToken()) {
      // Assigning KnishIO client to the factory
      this.client = client

      // Getting fingerprint metadata
      let fingerprintData = null
      client.getFingerprintData().then(fingerprintDataResult => {
        fingerprintData = fingerprintDataResult

        // Gathering system data
        if (fingerprintData.system) {
          this.hostMeta.platform = fingerprintData.system.platform
          this.hostMeta.userAgent = fingerprintData.system.useragent
          this.hostMeta.browserName = fingerprintData.system.browser.name
          this.hostMeta.browserVersion = fingerprintData.system.browser.version
        }

        // Gathering local data
        if (fingerprintData.locales) {
          this.hostMeta.timezone = fingerprintData.locales.timezone
          this.hostMeta.languges = fingerprintData.locales.languages
        }
      })

      // Obtaining user's remote IP
      KnishIOEventFactory.getUserIp().then(ip => {
        this.hostMeta.ip = ip
      })

      // Assigning metaType
      this.metaType = metaType
    } else {
      throw new Error('KnishIO Client not Authorized - unable to create Event Factory!')
    }
  }

  /**
   * Retrieves the user's remote IP address using the ipify API.
   *
   * @returns {Promise<string>} A promise that resolves to the user's IP address.
   * @throws {Error} If there is an error fetching the IP address.
   */
  static async getUserIp () {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      if (!response.ok) {
        throw new Error('Failed to fetch IP address')
      }
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.error('Error fetching IP address:', error)
      throw error
    }
  }

  /**
   * Generates a UUID (Universally Unique Identifier).
   *
   * @returns {string} The generated UUID.
   */
  static generateUUID () {
    // Use crypto.getRandomValues if available, otherwise fallback to Math.random
    const getRandomValues = typeof crypto !== 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) ||
      typeof msCrypto !== 'undefined' && typeof window.msCrypto.getRandomValues === 'function' && msCrypto.getRandomValues.bind(msCrypto) ||
      function (buf) {
        for (let i = 0, r; i < buf.length; i++) {
          if ((i & 0x03) === 0) r = Math.random() * 0x100000000
          buf[i] = r >>> ((i & 0x03) << 3) & 0xff
        }
      }

    const buf = new Uint8Array(16)
    getRandomValues(buf)

    // Set the version (4) and variant (2)
    buf[6] = (buf[6] & 0x0f) | 0x40
    buf[8] = (buf[8] & 0x3f) | 0x80

    const hex = Array.from(buf, byte => byte.toString(16).padStart(2, '0')).join('')

    return `${ hex.substring(0, 8) }-${ hex.substring(8, 12) }-${ hex.substring(12, 16) }-${ hex.substring(16, 20) }-${ hex.substring(20) }`
  }

  getEvents (filter = []) {
    return this.client.queryAtom({
      metaType: this.metaType,
      isotope: 'M',
      filter
    })
  }

  makeEvent (eventType, eventMeta = {}) {
    const meta = {
      eventType
    }
    // Merging in host metadata
    Object.keys(this.hostMeta).forEach(key => {
      meta[key] = this.hostMeta[key]
    })

    // Merging in event metadata
    Object.keys(eventMeta).forEach(key => {
      if (!Object.keys(meta).includes(key)) {
        meta[key] = eventMeta[key]
      } else {
        throw new Error(`Duplicate usage of event metadata key ${ key }!`)
      }
    })

    const metaId = KnishIOEventFactory.generateUUID()
    console.log({
      metaType: this.metaType,
      metaId,
      meta
    })

    return this.client.createMeta({
      metaType: this.metaType,
      metaId,
      meta
    })
  }
}
