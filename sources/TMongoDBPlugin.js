/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @file Todo
 *
 * @example Todo
 *
 */

import { TAbstractDatabasePlugin } from 'itee-database'
import { getFilesPathsUnder }      from 'itee-utils'
import {
    isEmptyFile,
    isFunction,
    isInvalidDirectoryPath
}                                  from 'itee-validators'
import { join }                    from 'path'

class TMongoDBPlugin extends TAbstractDatabasePlugin {

    constructor ( parameters = {} ) {

        const _parameters = {
            ...{
                types:   [],
                schemas: []
            },
            ...parameters
        }

        super( _parameters )

        this.types   = _parameters.types
        this.schemas = _parameters.schemas

    }

    get schemas () {
        return this._schemas
    }

    set schemas ( value ) {
        this._schemas = value
    }

    get types () {
        return this._types
    }

    set types ( value ) {
        this._types = value
    }

    addSchema ( value ) {

        this._schemas.push( value )
        return this

    }

    addType ( value ) {

        this._types.push( value )
        return this

    }

    beforeRegisterRoutes ( Mongoose ) {

        super.beforeRegisterRoutes( Mongoose )

        this._searchLocalTypes()
        this._registerTypes( Mongoose )

        this._searchLocalSchemas()
        this._registerSchemas( Mongoose )

    }

    _searchLocalTypes () {

        const typesBasePath = join( this.__dirname, 'types' )
        if ( isInvalidDirectoryPath( typesBasePath ) ) {
            this.logger.warn( `Unable to find "types" folder for path "${ typesBasePath }"` )
            return
        } else {
            this.logger.log( `Add types from: ${ typesBasePath }` )
        }

        const typesFilesPaths = getFilesPathsUnder( typesBasePath )
        let typeFilePath      = ''
        let typeFile          = undefined

        for ( let typeIndex = 0, numberOfTypes = typesFilesPaths.length ; typeIndex < numberOfTypes ; typeIndex++ ) {

            typeFilePath = typesFilesPaths[ typeIndex ]
            typeFile     = require( typeFilePath )
            this._types.push( typeFile )

        }

    }

    _registerTypes ( Mongoose ) {

        for ( let type of this._types ) {

            this.logger.log( `Register type: ${ type.name }` )
            type( Mongoose )

        }

    }

    _searchLocalSchemas () {

        const localSchemasBasePath = join( this.__dirname, 'schemas' )
        if ( isInvalidDirectoryPath( localSchemasBasePath ) ) {
            this.logger.warn( `Unable to find "schemas" folder for path "${ localSchemasBasePath }"` )
            return
        } else {
            this.logger.log( `Add schemas from: ${ localSchemasBasePath }` )
        }

        const localSchemasFilesPaths = getFilesPathsUnder( localSchemasBasePath )
        let localSchemaFilePath      = ''
        let localSchemaFile          = undefined
        for ( let schemaIndex = 0, numberOfSchemas = localSchemasFilesPaths.length ; schemaIndex < numberOfSchemas ; schemaIndex++ ) {

            localSchemaFilePath = localSchemasFilesPaths[ schemaIndex ]

            if ( isEmptyFile( localSchemaFilePath ) ) {

                this.logger.warn( `Skip empty local database schema: ${ localSchemaFilePath }` )
                continue

            }

            localSchemaFile = require( localSchemaFilePath )
            this._schemas.push( localSchemaFile )

        }

    }

    _registerSchemas ( Mongoose ) {

        for ( let schema of this._schemas ) {

            this.logger.log( `Register schema: ${ schema.name }` )

            if ( isFunction( schema.registerModelTo ) ) {

                schema.registerModelTo( Mongoose )

            } else if ( isFunction( schema ) ) {

                schema( Mongoose )

            } else {

                this.logger.error( `Unable to register local database schema: ${ schema }` )

            }

        }

    }

}

export { TMongoDBPlugin }
