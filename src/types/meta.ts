/*
                               (
                              (/(
                              (//(
                              (///(
                             (/////(
                             (//////(                          )
                            (////////(                        (/)
                            (////////(                       (///)
                           (//////////(                      (////)
                           (//////////(                     (//////)
                          (////////////(                    (///////)
                         (/////////////(                   (/////////)
                        (//////////////(                  (///////////)
                        (///////////////(                (/////////////)
                       (////////////////(               (//////////////)
                      (((((((((((((((((((              (((((((((((((((
                     (((((((((((((((((((              ((((((((((((((
                     (((((((((((((((((((            ((((((((((((((
                    ((((((((((((((((((((           (((((((((((((
                    ((((((((((((((((((((          ((((((((((((
                    (((((((((((((((((((         ((((((((((((
                    (((((((((((((((((((        ((((((((((
                    ((((((((((((((((((/      (((((((((
                    ((((((((((((((((((     ((((((((
                    (((((((((((((((((    (((((((
                   ((((((((((((((((((  (((((
                   #################  ##
                   ################  #
                  ################# ##
                 %################  ###
                 ###############(   ####
                ###############      ####
               ###############       ######
              %#############(        (#######
             %#############           #########
            ############(              ##########
           ###########                  #############
          #########                      ##############
        %######

        Powered by Knish.IO: Connecting a Decentralized World

Please visit https://github.com/WishKnish/KnishIO-Client-JS for information.

License: https://github.com/WishKnish/KnishIO-Client-JS/blob/master/LICENSE
*/

/**
 * Meta-related type definitions for Knish.IO SDK
 */


export type MetaValue = string | number | boolean | null;

export interface MetaObject {
  [key: string]: MetaValue | MetaObject | MetaArray;
}

export interface MetaArray extends Array<MetaValue | MetaObject | MetaArray> {}

export type MetaData = MetaObject | NormalizedMeta[] | MetaValue | Record<string, unknown>;

export interface NormalizedMeta {
  key: string;
  value: MetaValue;
}

export interface AtomMetaOptions extends MetaObject {
  key?: string;
  value?: MetaValue;
}


export interface PolicyMeta {
  policy?: string;
  encrypted?: boolean;
  [key: string]: MetaValue | undefined;
}

export interface PolicyMetaStructure {
  read?: Record<string, string[]>;
  write?: Record<string, string[]>;
  [key: string]: Record<string, string[]> | undefined;
}

export interface PolicyRule {
  field: string;
  operator: string;
  value: MetaValue;
  condition?: 'AND' | 'OR';
  action?: 'read' | 'write';
  key?: string;
}