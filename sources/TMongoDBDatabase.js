/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @file Todo
 *
 * @example Todo
 *
 */

import { TAbstractDatabase } from 'itee-database'
import Mongoose              from 'mongoose'

class TMongoDBDatabase extends TAbstractDatabase {

    constructor( parameters = {} ) {

        const _parameters = {
            ...{
                databaseUrl:     '',
                databaseOptions: {
                    useNewUrlParser:    true,
                    useUnifiedTopology: true
                }
            },
            ...parameters,
            ...{
                driver: Mongoose
            }
        }

        super( _parameters )

        this.databaseUrl     = _parameters.databaseUrl
        this.databaseOptions = _parameters.databaseOptions

    }

    close( onCloseCallback ) {

        this._driver.connection.close( onCloseCallback )

    }

    connect() {

        this._driver
            .connect( this.databaseUrl, this.databaseOptions )
            .then( ( info ) => {
                this.logger.log( info )
            } )
            .then( ( /*info*/ ) => {
                const regex      = /:(\w*)@/g
                const matchs     = this.databaseUrl.match( regex )
                const escapedUrl = ( matchs )
                                   ? this.databaseUrl.replace( matchs[ 0 ], ':*******@' )
                                   : this.databaseUrl

                this.logger.log( `MongoDB at ${ escapedUrl } is connected !` )
            } )
            // .then( ( what ) => {
            //     this.logger.log( `MongoDB at ${ escapedUrl } is connected !` )
            // } )
            .catch( ( err ) => {
                this.logger.error( err )
            } )

    }

    init() {
        super.init()

    }

    on( eventName, callback ) {

        const availableEventNames = [ 'connecting', 'connected', 'open', 'disconnecting', 'disconnected', 'reconnected', 'close', 'error' ]

        if ( availableEventNames.indexOf( eventName ) === -1 ) {
            return
        }

        this._driver.connection.on( eventName, callback )

    }

}

export { TMongoDBDatabase }
