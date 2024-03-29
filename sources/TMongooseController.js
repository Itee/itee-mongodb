/**
 * @author [Tristan Valcke]{@link https://github.com/Itee}
 * @license [BSD-3-Clause]{@link https://opensource.org/licenses/BSD-3-Clause}
 *
 * @class TMongooseController
 * @classdesc The TMongooseController is the base class to perform CRUD operations on the database
 */

import { TAbstractDataController } from 'itee-database'
import {
    isEmptyArray,
    isNull,
    isUndefined
}                                  from 'itee-validators'
import Mongoose                    from 'mongoose'

class TMongooseController extends TAbstractDataController {

    constructor ( parameters = {} ) {

        const _parameters = {
            ...{
                schemaName: ''
            },
            ...parameters,
            ...{
                driver: Mongoose
            }
        }

        super( _parameters )

        this.databaseSchema = this._driver.model( _parameters.schemaName )

    }

    get databaseSchema () {

        return this._databaseSchema

    }

    set databaseSchema ( value ) {

        if ( isNull( value ) ) { throw new TypeError( 'Database schema cannot be null.' ) }
        if ( isUndefined( value ) ) { throw new TypeError( 'Database schema cannot be undefined.' ) }

        this._databaseSchema = value

    }

    setDatabaseSchema ( value ) {

        this.databaseSchema = value
        return this

    }

    _createMany ( datas, response ) {
        super._createMany( datas, response )

        this._databaseSchema.create( datas, this.return( response ) )

    }

    // Create
    _createOne ( data, response ) {
        super._createOne( data, response )

        this._databaseSchema.create( data, this.return( response ) )

    }

    _deleteAll ( response ) {
        super._deleteAll( response )

        this._databaseSchema.collection.drop( TMongooseController.return( response ) )

    }

    _deleteMany ( ids, response ) {
        super._deleteMany( ids, response )

        this._databaseSchema.deleteMany( { '_id': { $in: ids } }, this.return( response ) )

    }

    // Delete
    _deleteOne ( id, response ) {
        super._deleteOne( id, response )

        this._databaseSchema
            .findByIdAndDelete( id )
            .then( data => TMongooseController.returnData( data, response ) )
            .catch( error => TMongooseController.returnError( error, response ) )

    }

    _deleteWhere ( query, response ) {
        super._deleteWhere( query, response )

        this._databaseSchema.deleteMany( query, this.return( response ) )

    }

    _readAll ( projection, response ) {
        super._readAll( projection, response )

        this._databaseSchema
            .find( {}, projection )
            .lean()
            .exec()
            .then( data => TMongooseController.returnData( data, response ) )
            .catch( error => TMongooseController.returnError( error, response ) )

    }

    _readMany ( ids, projection, response ) {
        super._readMany( ids, projection, response )

        this._databaseSchema
            .find( { '_id': { $in: ids } }, projection )
            .lean()
            .exec()
            .then( ( data ) => {

                if ( isNull( data ) || isEmptyArray( data ) ) {
                    TMongooseController.returnNotFound( response )
                } else if ( ids.length !== data.length ) {
                    TMongooseController.returnErrorAndData( {
                        title:   'Missing data',
                        message: 'Some requested objects could not be found.'
                    }, data, response )
                } else {
                    TMongooseController.returnData( data, response )
                }

            } )
            .catch( error => TMongooseController.returnError( error, response ) )

    }

    // Read
    _readOne ( id, projection, response ) {
        super._readOne( id, projection, response )

        this._databaseSchema
            .findById( id, projection )
            .lean()
            .exec()
            .then( ( data ) => {

                if ( isNull( data ) ) {
                    TMongooseController.returnNotFound( response )
                } else {
                    TMongooseController.returnData( data, response )
                }

            } )
            .catch( error => TMongooseController.returnError( error, response ) )

    }

    _readWhere ( query, projection, response ) {
        super._readWhere( query, projection, response )

        this._databaseSchema
            .find( query, projection )
            .lean()
            .exec()
            .then( data => TMongooseController.returnData( data, response ) )
            .catch( error => TMongooseController.returnError( error, response ) )

    }

    _updateAll ( update, response ) {
        super._updateAll( update, response )

        this._databaseSchema.update( {}, update, { multi: true }, TMongooseController.return( response ) )

    }

    _updateMany ( ids, updates, response ) {
        super._updateMany( ids, updates, response )

        this._databaseSchema.update( { _id: { $in: ids } }, updates, { multi: true }, TMongooseController.return( response ) )

    }

    // Update
    _updateOne ( id, update, response ) {
        super._updateOne( id, update, response )

        this._databaseSchema
            .findByIdAndUpdate( id, update )
            .exec()
            .then( data => TMongooseController.returnData( data, response ) )
            .catch( error => TMongooseController.returnError( error, response ) )

    }

    _updateWhere ( query, update, response ) {
        super._updateWhere( query, update, response )

        this._databaseSchema.update( query, update, { multi: true }, TMongooseController.return( response ) )

    }

}

export { TMongooseController }
