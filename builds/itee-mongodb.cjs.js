/**
 * ┳      ┳┳┓         ┓┓     ┓ ┏┓ ┏┓      ┏┓            ┏┳ 
 * ┃╋┏┓┏┓ ┃┃┃┏┓┏┓┏┓┏┓┏┫┣┓  ┓┏┃ ┏┛ ┃┫  ━━  ┃ ┏┓┏┳┓┏┳┓┏┓┏┓ ┃┏
 * ┻┗┗ ┗ •┛ ┗┗┛┛┗┗┫┗┛┗┻┗┛  ┗┛┻•┗━•┗┛      ┗┛┗┛┛┗┗┛┗┗┗┛┛┗┗┛┛
 *                ┛                                        
 * @desc    The MongoDB database implementation for Itee projects
 * @author  [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 * 
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var iteeDatabase = require('itee-database');
var iteeValidators = require('itee-validators');
var Mongoose = require('mongoose');
var iteeUtils = require('itee-utils');
var fs = require('fs');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Mongoose__default = /*#__PURE__*/_interopDefaultLegacy(Mongoose);

/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @class TMongooseController
 * @classdesc The TMongooseController is the base class to perform CRUD operations on the database
 */

class TMongooseController extends iteeDatabase.TAbstractDataController {

    constructor ( parameters = {} ) {

        const _parameters = {
            ...{
                schemaName: ''
            },
            ...parameters,
            ...{
                driver: Mongoose__default["default"]
            }
        };

        super( _parameters );

        this.databaseSchema = this._driver.model( _parameters.schemaName );

    }

    get databaseSchema () {

        return this._databaseSchema

    }

    set databaseSchema ( value ) {

        if ( iteeValidators.isNull( value ) ) { throw new TypeError( 'Database schema cannot be null.' ) }
        if ( iteeValidators.isUndefined( value ) ) { throw new TypeError( 'Database schema cannot be undefined.' ) }

        this._databaseSchema = value;

    }

    setDatabaseSchema ( value ) {

        this.databaseSchema = value;
        return this

    }

    _createMany ( datas, response ) {
        super._createMany( datas, response );

        this._databaseSchema.create( datas, this.return( response ) );

    }

    // Create
    _createOne ( data, response ) {
        super._createOne( data, response );

        this._databaseSchema.create( data, this.return( response ) );

    }

    _deleteAll ( response ) {
        super._deleteAll( response );

        this._databaseSchema.collection.drop( TMongooseController.return( response ) );

    }

    _deleteMany ( ids, response ) {
        super._deleteMany( ids, response );

        this._databaseSchema.deleteMany( { '_id': { $in: ids } }, this.return( response ) );

    }

    // Delete
    _deleteOne ( id, response ) {
        super._deleteOne( id, response );

        this._databaseSchema
            .findByIdAndDelete( id )
            .then( data => TMongooseController.returnData( data, response ) )
            .catch( error => TMongooseController.returnError( error, response ) );

    }

    _deleteWhere ( query, response ) {
        super._deleteWhere( query, response );

        this._databaseSchema.deleteMany( query, this.return( response ) );

    }

    _readAll ( projection, response ) {
        super._readAll( projection, response );

        this._databaseSchema
            .find( {}, projection )
            .lean()
            .exec()
            .then( data => TMongooseController.returnData( data, response ) )
            .catch( error => TMongooseController.returnError( error, response ) );

    }

    _readMany ( ids, projection, response ) {
        super._readMany( ids, projection, response );

        this._databaseSchema
            .find( { '_id': { $in: ids } }, projection )
            .lean()
            .exec()
            .then( ( data ) => {

                if ( iteeValidators.isNull( data ) || iteeValidators.isEmptyArray( data ) ) {
                    TMongooseController.returnNotFound( response );
                } else if ( ids.length !== data.length ) {
                    TMongooseController.returnErrorAndData( {
                        title:   'Missing data',
                        message: 'Some requested objects could not be found.'
                    }, data, response );
                } else {
                    TMongooseController.returnData( data, response );
                }

            } )
            .catch( error => TMongooseController.returnError( error, response ) );

    }

    // Read
    _readOne ( id, projection, response ) {
        super._readOne( id, projection, response );

        this._databaseSchema
            .findById( id, projection )
            .lean()
            .exec()
            .then( ( data ) => {

                if ( iteeValidators.isNull( data ) ) {
                    TMongooseController.returnNotFound( response );
                } else {
                    TMongooseController.returnData( data, response );
                }

            } )
            .catch( error => TMongooseController.returnError( error, response ) );

    }

    _readWhere ( query, projection, response ) {
        super._readWhere( query, projection, response );

        this._databaseSchema
            .find( query, projection )
            .lean()
            .exec()
            .then( data => TMongooseController.returnData( data, response ) )
            .catch( error => TMongooseController.returnError( error, response ) );

    }

    _updateAll ( update, response ) {
        super._updateAll( update, response );

        this._databaseSchema.update( {}, update, { multi: true }, TMongooseController.return( response ) );

    }

    _updateMany ( ids, updates, response ) {
        super._updateMany( ids, updates, response );

        this._databaseSchema.update( { _id: { $in: ids } }, updates, { multi: true }, TMongooseController.return( response ) );

    }

    // Update
    _updateOne ( id, update, response ) {
        super._updateOne( id, update, response );

        this._databaseSchema
            .findByIdAndUpdate( id, update )
            .exec()
            .then( data => TMongooseController.returnData( data, response ) )
            .catch( error => TMongooseController.returnError( error, response ) );

    }

    _updateWhere ( query, update, response ) {
        super._updateWhere( query, update, response );

        this._databaseSchema.update( query, update, { multi: true }, TMongooseController.return( response ) );

    }

}

/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @module sources/cores/functions/isFunction
 * @desc Export function to validate if a value is a function or not
 * @example
 *
 * import { isFunction } from 'itee-validators'
 *
 * if( isFunction( value ) ) {
 *     //...
 * } else {
 *     //...
 * }
 *
 */

/**
 * Check if given data is a function
 *
 * @param data {*} The data to check against the functionality
 * @returns {boolean} true if data is a function, false otherwise.
 */
function isFunction( data ) {
    return ( typeof data === 'function' )
}

/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @module sources/file-system/paths/isValidPath
 * @description Export function to validate if a value is a valid path
 *
 * @requires {@link module: [fs]{@link https://nodejs.org/api/fs.html}}
 *
 * @example
 *
 * import { isValidPath } from 'itee-validators'
 *
 * if( isValidPath( value ) ) {
 *     //...
 * } else {
 *     //...
 * }
 *
 */

/**
 * Check if given data is a valid file path
 *
 * @param data {*} The data to check against the path type
 * @returns {boolean} true if data is a valid path, false otherwise
 */
function isValidPath( data ) {
    return fs.existsSync( data )
}

/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @module sources/cores/voids/isDefined
 * @desc Export function to validate if a value is a defined or not
 * @example
 *
 * import { isDefined } from 'itee-validators'
 *
 * if( isDefined( value ) ) {
 *     //...
 * } else {
 *     //...
 * }
 *
 */

/**
 * Check if given data is not null and not undefined
 *
 * @param data {*} The data to check against the existence
 * @returns {boolean} true if data is not null and not undefined, false otherwise.
 */
function isDefined( data ) {
    return ( ( data !== null ) && ( typeof data !== 'undefined' ) )
}

/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @module sources/cores/strings/isString
 * @desc Export function to validate if a value is a string
 * @example
 *
 * import { isString } from 'itee-validators'
 *
 * if( isString( value ) ) {
 *     //...
 * } else {
 *     //...
 * }
 *
 */

/**
 * Check if given data is a string
 *
 * @param data {*} The data to check against the string type
 * @returns {boolean} true if data is a string, false otherwise.
 */
function isString( data ) {
    return ( typeof data === 'string' || data instanceof String )
}

/**
 * Check if given data is not a string
 *
 * @param data {*} The data to check against the string type
 * @returns {boolean} true if data is not a string, false otherwise.
 */
function isNotString( data ) {
    return !isString( data )
}

// #endif

/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @module sources/file-system/directories/isDirectoryPath
 * @description Export function to validate if a value is a directories path
 *
 * @requires {@link module: [fs]{@link https://nodejs.org/api/fs.html}}
 *
 * @example
 *
 * import { isDirectoryPath } from 'itee-validators'
 *
 * if( isDirectoryPath( value ) ) {
 *     //...
 * } else {
 *     //...
 * }
 *
 */

/**
 * Check if given path is a directory path
 *
 * @param path {string|Buffer|URL} The data to check against the directory path type
 * @returns {boolean} true if path is a directory path, false otherwise
 */
function isDirectoryPath( path ) {
    if ( isNotString( path ) && !( path instanceof Buffer ) && !( path instanceof URL ) ) {
        return false
        // throw new TypeError( 'Invalid path type! Expect string, buffer or url.' )
    }

    const stat = fs.statSync( path, { throwIfNoEntry: false } );
    return isDefined( stat ) && stat.isDirectory()
}

/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @module sources/file-system/directories/isValidDirectoryPath
 * @description Export function to validate if a value is a valid directory path
 * @example
 *
 * import { isValidDirectoryPath } from 'itee-validators'
 *
 * if( isValidDirectoryPath( value ) ) {
 *     //...
 * } else {
 *     //...
 * }
 *
 */

/**
 * Check if given data is a valid directory path
 *
 * @param data {*} The data to check against the directory path type
 * @returns {boolean} true if data is a valid directory path, false otherwise
 */
function isValidDirectoryPath( data ) {
    return ( isValidPath( data ) && isDirectoryPath( data ) )
}

/**
 * Check if given data is an invalid directory path
 *
 * @param data {*} The data to check against the directory path type
 * @returns {boolean} true if data is an invalid directory path, false otherwise
 */
function isInvalidDirectoryPath( data ) {
    return !isValidDirectoryPath( data )
}

/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @module sources/file-system/files/isFilePath
 * @description Export function to validate if a value is a file path
 *
 * @requires {@link module: [fs]{@link https://nodejs.org/api/fs.html}}
 *
 * @example
 *
 * import { isFilePath } from 'itee-validators'
 *
 * if( isFilePath( value ) ) {
 *     //...
 * } else {
 *     //...
 * }
 *
 */

/**
 * Check if given path is a file path
 *
 * @param path {string|Buffer|URL} The data to check against the file path type
 * @returns {boolean} true if path is a file path, false otherwise
 */
function isFilePath( path ) {
    if ( isNotString( path ) && !( path instanceof Buffer ) && !( path instanceof URL ) ) {
        return false
        // throw new TypeError( 'Invalid path type! Expect string, buffer or url.' )
    }

    const stat = fs.statSync( path, { throwIfNoEntry: false } );
    return isDefined( stat ) && stat.isFile()
}

/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @module sources/file-system/files/isEmptyFile
 * @description Export function to validate if a value is an empty file
 *
 * @requires {@link module: [fs]{@link https://nodejs.org/api/fs.html}}
 *
 * @example
 *
 * import { isEmptyFile } from 'itee-validators'
 *
 * if( isEmptyFile( value ) ) {
 *     //...
 * } else {
 *     //...
 * }
 *
 */

/**
 * Check if given file path is an empty file more or less a threshold in bytes.
 *
 * @param filePath {string|Buffer|URL} The directory path to check the emptiness
 * @param threshold {number} An amount of byte below which it consider the file as empty ( 0 as default ).
 * @returns {boolean} true if file is empty, false otherwise
 */
function isEmptyFile( filePath, threshold = 0 ) {
    if ( isNotString( filePath ) && !( filePath instanceof Buffer ) && !( filePath instanceof URL ) ) {
        return false
        // throw new TypeError( 'Invalid path type! Expect string, buffer or url.' )
    }

    return isFilePath( filePath ) && ( fs.statSync( filePath ).size <= threshold )
}

/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @file Todo
 *
 * @example Todo
 *
 */

class TMongoDBPlugin extends iteeDatabase.TAbstractDatabasePlugin {

    constructor( parameters = {} ) {

        const _parameters = {
            ...{
                types:   [],
                schemas: []
            },
            ...parameters
        };

        super( _parameters );

        this.types   = _parameters.types;
        this.schemas = _parameters.schemas;

    }

    get schemas() {
        return this._schemas
    }

    set schemas( value ) {
        this._schemas = value;
    }

    get types() {
        return this._types
    }

    set types( value ) {
        this._types = value;
    }

    addSchema( value ) {

        this._schemas.push( value );
        return this

    }

    addType( value ) {

        this._types.push( value );
        return this

    }

    beforeRegisterRoutes( Mongoose ) {

        super.beforeRegisterRoutes( Mongoose );

        this._searchLocalTypes();
        this._registerTypes( Mongoose );

        this._searchLocalSchemas();
        this._registerSchemas( Mongoose );

    }

    _searchLocalTypes() {

        const typesBasePath = path.join( this.__dirname, 'types' );
        if ( isInvalidDirectoryPath( typesBasePath ) ) {
            this.logger.warn( `Unable to find "types" folder for path "${ typesBasePath }"` );
            return
        } else {
            this.logger.log( `Add types from: ${ typesBasePath }` );
        }

        const typesFilesPaths = iteeUtils.getFilesPathsUnder( typesBasePath );
        let typeFilePath      = '';
        let typeFile          = undefined;

        for ( let typeIndex = 0, numberOfTypes = typesFilesPaths.length ; typeIndex < numberOfTypes ; typeIndex++ ) {

            typeFilePath = typesFilesPaths[ typeIndex ];
            typeFile     = require( typeFilePath );
            this._types.push( typeFile );

        }

    }

    _registerTypes( Mongoose ) {

        for ( let type of this._types ) {

            this.logger.log( `Register type: ${ type.name }` );
            type( Mongoose );

        }

    }

    _searchLocalSchemas() {

        const localSchemasBasePath = path.join( this.__dirname, 'schemas' );
        if ( isInvalidDirectoryPath( localSchemasBasePath ) ) {
            this.logger.warn( `Unable to find "schemas" folder for path "${ localSchemasBasePath }"` );
            return
        } else {
            this.logger.log( `Add schemas from: ${ localSchemasBasePath }` );
        }

        const localSchemasFilesPaths = iteeUtils.getFilesPathsUnder( localSchemasBasePath );
        let localSchemaFilePath      = '';
        let localSchemaFile          = undefined;
        for ( let schemaIndex = 0, numberOfSchemas = localSchemasFilesPaths.length ; schemaIndex < numberOfSchemas ; schemaIndex++ ) {

            localSchemaFilePath = localSchemasFilesPaths[ schemaIndex ];

            if ( isEmptyFile( localSchemaFilePath ) ) {

                this.logger.warn( `Skip empty local database schema: ${ localSchemaFilePath }` );
                continue

            }

            localSchemaFile = require( localSchemaFilePath );
            this._schemas.push( localSchemaFile );

        }

    }

    _registerSchemas( Mongoose ) {

        for ( let schema of this._schemas ) {

            this.logger.log( `Register schema: ${ schema.name }` );

            if ( isFunction( schema.registerModelTo ) ) {

                schema.registerModelTo( Mongoose );

            } else if ( isFunction( schema ) ) {

                schema( Mongoose );

            } else {

                this.logger.error( `Unable to register local database schema: ${ schema }` );

            }

        }

    }

}

/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @file Todo
 *
 * @example Todo
 *
 */

class TMongoDBDatabase extends iteeDatabase.TAbstractDatabase {

    constructor ( parameters = {} ) {

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
                driver: Mongoose__default["default"]
            }
        };

        super( _parameters );

        this.databaseUrl     = _parameters.databaseUrl;
        this.databaseOptions = _parameters.databaseOptions;

    }

    close ( onCloseCallback ) {

        this._driver.connection.close( onCloseCallback );

    }

    connect () {

        this._driver
            .connect( this.databaseUrl, this.databaseOptions )
            .then( ( info ) => {
                this.logger.log( info );
            } )
            .then( ( /*info*/ ) => {
                const regex      = /:(\w*)@/g;
                const matchs     = this.databaseUrl.match( regex );
                const escapedUrl = ( matchs )
                    ? this.databaseUrl.replace( matchs[ 0 ], ':*******@' )
                    : this.databaseUrl;

                this.logger.log( `MongoDB at ${ escapedUrl } is connected !` );
            } )
            // .then( ( what ) => {
            //     this.logger.log( `MongoDB at ${ escapedUrl } is connected !` )
            // } )
            .catch( ( err ) => {
                this.logger.error( err );
            } );

    }

    init () {
        super.init();

    }

    on ( eventName, callback ) {

        const availableEventNames = [ 'connecting', 'connected', 'open', 'disconnecting', 'disconnected', 'reconnected', 'close', 'error' ];

        if ( availableEventNames.indexOf( eventName ) === -1 ) {
            return
        }

        this._driver.connection.on( eventName, callback );

    }

}

exports.TMongoDBDatabase = TMongoDBDatabase;
exports.TMongoDBPlugin = TMongoDBPlugin;
exports.TMongooseController = TMongooseController;
//# sourceMappingURL=itee-mongodb.cjs.js.map
