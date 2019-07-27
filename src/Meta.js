// Copyright 2019 WishKnish Corp. All rights reserved.
// You may use, distribute, and modify this code under the GPLV3 license, which is provided at:
// https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
// This experimental code is part of the Knish.IO API Client and is provided AS IS with no warranty whatsoever.

import { box, randomBytes } from 'tweetnacl';
import {
  decodeUTF8,
  encodeUTF8,
  encodeBase64,
  decodeBase64
} from 'tweetnacl-util';
import { toLittleEndian } from "./util/strings";
import bigInt from 'big-integer';

export default class Meta {
  constructor ( modelType, modelId, meta, snapshotMolecule = null ) {
    this.modelType = modelType;
    this.modelId = modelId;
    this.meta = meta;
    this.snapshotMolecule = snapshotMolecule;
    this.created_at = +new Date;
  }

  /**
   * @param {Array | Object} meta
   * @return {Array}
   */
  static normalizeMeta ( meta ) {
    if ( toString.call( meta ) === '[object Object]' ) {
      const target = [];
      for ( const property in meta ) {
        if ( meta.hasOwnProperty( property ) ) {
          target.push( { key: property, value: meta[ property ] } );
        }
      }
      return target;
    }
    return meta;
  }

  /**
   * Used for encrypting a meta array / object with a shared key
   *
   * @param meta
   * @param senderPrivateKey
   * @param recipientPublicKey
   * @returns {string}
   */
  static encryptMeta ( meta, senderPrivateKey, recipientPublicKey ) {

    const senderPrivateKeyAsUint8Array = typeof senderPrivateKey === 'object' ? senderPrivateKey : toLittleEndian( bigInt( senderPrivateKey, 16, '0123456789abcdef' ) );
    const recipientPublicKeyAsUint8Array = typeof recipientPublicKey === 'object' ? recipientPublicKey : toLittleEndian( bigInt( recipientPublicKey, 16, '0123456789abcdef' ) );

    const nonce = randomBytes( box.nonceLength );
    const sharedKey = box.before( recipientPublicKeyAsUint8Array, senderPrivateKeyAsUint8Array );

    const messageUint8 = decodeUTF8( JSON.stringify( meta ) );
    const encrypted = box.after( messageUint8, nonce, sharedKey );

    const fullMessage = new Uint8Array( nonce.length + encrypted.length );
    fullMessage.set( nonce );
    fullMessage.set( encrypted, nonce.length );

    const base64FullMessage = encodeBase64( fullMessage );
    return base64FullMessage;
  }

  /**
   * Used for decrypting an encrypted meta object / array
   *
   * @param meta
   * @param senderPublicKey
   * @param recipientPrivateKey
   * @returns {any}
   */
  static decryptMeta ( meta, senderPublicKey, recipientPrivateKey ) {
    const senderPublicKeyKeyAsUint8Array = typeof senderPublicKey === 'object' ? senderPublicKey : toLittleEndian( bigInt( senderPublicKey, 16, '0123456789abcdef' ) );
    const recipientPrivateKeyAsUint8Array = typeof recipientPrivateKey === 'object' ? recipientPrivateKey : toLittleEndian( bigInt( recipientPrivateKey, 16, '0123456789abcdef' ) );

    const messageWithNonceAsUint8Array = decodeBase64( meta );
    const nonce = messageWithNonceAsUint8Array.slice( 0, box.nonceLength );
    const sharedKey = box.before( senderPublicKeyKeyAsUint8Array, recipientPrivateKeyAsUint8Array );
    const message = messageWithNonceAsUint8Array.slice(
      box.nonceLength,
      meta.length
    );

    const decrypted = box.open.after( message, nonce, sharedKey );
    if ( !decrypted ) {
      throw new Error( 'Could not decrypt message' );
    }

    const base64DecryptedMessage = encodeUTF8( decrypted );
    return JSON.parse( base64DecryptedMessage );
  }
}
