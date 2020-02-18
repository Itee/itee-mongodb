console.log('Itee.Database.MongoDB v1.0.2 - CommonJs')
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var iteeValidators = require('itee-validators');
var iteeDatabase = require('itee-database');
var iteeUtils = require('itee-utils');
var path = _interopDefault(require('path'));
var MongoDBDriver = require('mongoose');

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
                driver:     null,
                schemaName: ''
            }, ...parameters
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

        this._databaseSchema.collection.drop( this.return( response ) );

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
            .then( data => iteeDatabase.TAbstractDataController.returnData( data, response ) )
            .catch( error => iteeDatabase.TAbstractDataController.returnError( error, response ) );

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
            .then( data => iteeDatabase.TAbstractDataController.returnData( data, response ) )
            .catch( error => iteeDatabase.TAbstractDataController.returnError( error, response ) );

    }

    _readMany ( ids, projection, response ) {
        super._readMany( ids, projection, response );

        this._databaseSchema
            .find( { '_id': { $in: ids } }, projection )
            .lean()
            .exec()
            .then( ( data ) => {

                if ( iteeValidators.isNull( data ) || iteeValidators.isEmptyArray( data ) ) {
                    iteeDatabase.TAbstractDataController.returnNotFound( response );
                } else if ( ids.length !== data.length ) {
                    iteeDatabase.TAbstractDataController.returnErrorAndData( {
                        title:   'Missing data',
                        message: 'Some requested objects could not be found.'
                    }, data, response );
                } else {
                    iteeDatabase.TAbstractDataController.returnData( data, response );
                }

            } )
            .catch( error => iteeDatabase.TAbstractDataController.returnError( error, response ) );

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
                    iteeDatabase.TAbstractDataController.returnNotFound( response );
                } else {
                    iteeDatabase.TAbstractDataController.returnData( data, response );
                }

            } )
            .catch( error => iteeDatabase.TAbstractDataController.returnError( error, response ) );

    }

    _readWhere ( query, projection, response ) {
        super._readWhere( query, projection, response );

        this._databaseSchema
            .find( query, projection )
            .lean()
            .exec()
            .then( data => iteeDatabase.TAbstractDataController.returnData( data, response ) )
            .catch( error => iteeDatabase.TAbstractDataController.returnError( error, response ) );

    }

    _updateAll ( update, response ) {
        super._updateAll( update, response );

        this._databaseSchema.update( {}, update, { multi: true }, this.return( response ) );

    }

    _updateMany ( ids, updates, response ) {
        super._updateMany( ids, updates, response );

        this._databaseSchema.update( { _id: { $in: ids } }, updates, { multi: true }, this.return( response ) );

    }

    // Update
    _updateOne ( id, update, response ) {
        super._updateOne( id, update, response );

        this._databaseSchema
            .findByIdAndUpdate( id, update )
            .exec()
            .then( data => iteeDatabase.TAbstractDataController.returnData( data, response ) )
            .catch( error => iteeDatabase.TAbstractDataController.returnError( error, response ) );

    }

    _updateWhere ( query, update, response ) {
        super._updateWhere( query, update, response );

        this._databaseSchema.update( query, update, { multi: true }, this.return( response ) );

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

class TMongoDBPlugin extends iteeDatabase.TAbstractDatabasePlugin {

    constructor ( parameters = {} ) {

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

    get schemas () {
        return this._schemas
    }

    set schemas ( value ) {
        this._schemas = value;
    }

    get types () {
        return this._types
    }

    set types ( value ) {
        this._types = value;
    }

    addSchema ( value ) {

        this._schemas.push( value );
        return this

    }

    addType ( value ) {

        this._types.push( value );
        return this

    }

    beforeRegisterRoutes ( Mongoose ) {

        super.beforeRegisterRoutes( Mongoose );

        this._searchLocalTypes();
        this._registerTypes( Mongoose );

        this._searchLocalSchemas();
        this._registerSchemas( Mongoose );

    }

    _searchLocalTypes () {

        const typesBasePath = path.join( this.__dirname, 'types' );
        if ( iteeValidators.isInvalidDirectoryPath( typesBasePath ) ) {
            console.warn( `Unable to find "types" folder for path "${typesBasePath}"` );
            return
        } else {
            console.log( `Add types from: ${typesBasePath}` );
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

    _registerTypes ( Mongoose ) {

        for ( let type of this._types ) {

            console.log( `Register type: ${type.name}` );
            type( Mongoose );

        }

    }

    _searchLocalSchemas () {

        const localSchemasBasePath = path.join( this.__dirname, 'schemas' );
        if ( iteeValidators.isInvalidDirectoryPath( localSchemasBasePath ) ) {
            console.warn( `Unable to find "schemas" folder for path "${localSchemasBasePath}"` );
            return
        } else {
            console.log( `Add schemas from: ${localSchemasBasePath}` );
        }

        const localSchemasFilesPaths = iteeUtils.getFilesPathsUnder( localSchemasBasePath );
        let localSchemaFilePath      = '';
        let localSchemaFile          = undefined;
        for ( let schemaIndex = 0, numberOfSchemas = localSchemasFilesPaths.length ; schemaIndex < numberOfSchemas ; schemaIndex++ ) {

            localSchemaFilePath = localSchemasFilesPaths[ schemaIndex ];

            if ( iteeValidators.isEmptyFile( localSchemaFilePath ) ) {

                console.warn( `Skip empty local database schema: ${localSchemaFilePath}` );
                continue

            }

            localSchemaFile = require( localSchemaFilePath );
            this._schemas.push( localSchemaFile );

        }

    }

    _registerSchemas ( Mongoose ) {

        for ( let schema of this._schemas ) {

            console.log( `Register schema: ${schema.name}` );

            if ( iteeValidators.isFunction( schema.registerModelTo ) ) {

                schema.registerModelTo( Mongoose );

            } else if ( iteeValidators.isFunction( schema ) ) {

                schema( Mongoose );

            } else {

                console.error( `Unable to register local database schema: ${schema}` );

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
                databaseUrl: ''
            },
            ...parameters,
            ...{
                driver: MongoDBDriver
            }
        };

        super( _parameters );

        this.databaseUrl = _parameters.databaseUrl;

    }

    close ( onCloseCallback ) {

        this._driver.connection.close( onCloseCallback );

    }

    connect () {

        this._driver.connect( this.databaseUrl, { useNewUrlParser: true } )
            .then( ( info ) => {
                console.log( `MongoDB at ${this.databaseUrl} is connected ! ${info}` );
            } )
            .catch( ( err ) => {
                console.error( err );
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
