import { Logger } from '@nestjs/common';
import { AbstractDocument } from './abstract.document';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { NotFoundException } from 'src/exceptions';

/**
 * AbstractRepository serves as the base class for repositories handling interactions with a MongoDB database.
 * It provides common methods for document creation and retrieval.
 *
 * @typeparam TDocument - The type of document managed by the repository, extending AbstractDocument.
 */
export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  /**
   * create method saves document on database
   * @param document document before saved
   * @returns saved document with id
   */
  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = await this.model.create({
      ...document,
      _id: new Types.ObjectId(),
    });

      await createdDocument.save();
    
    return createdDocument;
  }

  /**
   * retrieves a single document from the database based on the specified filter criteria.
   * @param filter - The query object defining the filter conditions for the document retrieval.
   * @returns A promise resolving to the retrieved document.
   * @throws NotFoundException if no document matches the given query criteria.
   */

  async findOne(filter?: FilterQuery<TDocument>): Promise<TDocument> {
    // Attempt to find a document using the provided filter criteria
    const document = await this.model.findOne(filter, {});

    // If no document is found, log a warning and raise a NotFoundException
    if (!document) {
      this.logger.warn('document not found with query', filter);
      throw new NotFoundException('Document not found.');
    }

    // Return the retrieved document
    return document; //as TDocument;;
  }

  /**
   * check if document exists or not
   * @param filter - The query object defining the filter conditions for document checking. 
   * @returns A promise True Flag if found the document and return false if not
   */
  async exists(filter?: FilterQuery<TDocument>): Promise<boolean> {
    const found = await this.model.exists(filter);
    if(!found) return false;
    return true;
  }

  /**
   *  retrieves multiple documents from the database based on the specified filter criteria.
   *
   * @param filter - The query object defining the filter conditions for document retrieval.
   * @returns A promise resolving to an array of retrieved documents.
   */
  async findAll(filter: FilterQuery<TDocument>): Promise<TDocument[]> {
    // Retrieve multiple documents from the database using the provided filter criteria
    const documents = await this.model.find(filter, {});

    // Return the array of retrieved documents
    return documents;
  }

  /**
   * finds and updates a single document in the database based on the provided filter criteria.
   *
   * @param filter - The query object defining the filter conditions for document retrieval.
   * @param update - The update query defining the modifications to be applied to the document.
   * @returns A promise resolving to the updated document.
   * @throws NotFoundException if no document matches the given query criteria.
   */
  async findOneAndUpdate(
    filter: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    // Attempt to find a pne document, update using the provided filter criteria
    const document = await this.model.findOneAndUpdate(filter, update, {
      new: true,
    });

    // If no document is found, log a warning and raise a NotFoundException
    if (!document) {
      this.logger.warn('document not found with query', filter);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  /**
   * Asynchronously finds and deletes a single document from the database based on the provided filter criteria.
   *
   * @param filter - The query object defining the filter conditions for document retrieval.
   * @returns A promise resolving to the deleted document.
   * @throws NotFoundException if no document matches the given query criteria.
   */
  async findOneAndDelete(filter: FilterQuery<TDocument>): Promise<TDocument> {
    // Attempt to find a single document and delete it using the provided filter criteria
    const document = await this.model.findOneAndDelete(filter);

    // If no document is found, log a warning and raise a NotFoundException
    if (!document) {
      this.logger.warn('Document not found with query', filter);
      throw new NotFoundException('Document not found.');
    }

    // Return the deleted document
    return document;
  }
}
