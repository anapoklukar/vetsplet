const mongoose = require('mongoose');
const Transaction = mongoose.model('Transaction');

/**
 * @openapi
 *  /transactions:
 *   get:
 *    summary: Reads all transactions.
 *    description: Reads all transactions.
 *    tags: [Transaction]
 *    responses:
 *     '200':
 *      description: <b>OK</b>, a successful response.
 *     '404':
 *      description: <b>Not Found</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: Transaction not found.
 *     '500':
 *      description: <b>Internal Server Error</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: Internal Server Error.
 */
const transactionsReadAll = function (req, res) {
    Transaction.find({}, function (err, transactions) {
        if (err) {
        res.status(404).json(err);
        } else {
        res.status(200).json(transactions);
        }
    });
}

/**
 * @openapi
 * /transactions:
 *  post:
 *   summary: Creates new transaction.
 *   description: Creates new transaction.
 *   tags: [Transaction]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *         clientId:
 *          type: string
 *          description: Id of the client.
 *          example: 5f9d1b9b9c9a9b1b9c9a9b1b
 *         transactionHash:
 *          type: string
 *          description: Hash of the transaction.
 *          example: 0x0f9d1b9b9c9a9b1b9c9a9b1b
 *         action:
 *          type: string
 *          description: Action of the transaction.
 *          example: buy
 *         date:
 *          type: string
 *          description: Date of the transaction.
 *          example: 2020-10-30T11:50:00.000Z
 *       required:
 *         - clientId
 *         - transactionHash
 *         - action
 *         - date
 *    responses:
 *     '200':
 *      description: <b>OK</b>, a successful response.
 *     '404':
 *      description: <b>Not Found</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: Transaction not found.
 *     '500':
 *      description: <b>Internal Server Error</b>, with error message.
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *         message: Internal Server Error.
 */
const transactionsAddOne = function (req, res) {
    Transaction.create(req.body, function (err, transaction) {
        if (err) {
        res.status(400).json(err);
        } else {
        res.status(201).json(transaction);
        }
    });
}

/**
 * @openapi
 * /transactions/{transactionId}:
 *  get:
 *   summary: Reads transaction.
 *   description: Reads transaction.
 *   tags: [Transaction]
 *   responses:
 *    '200':
 *     description: <b>OK</b>, a successful response.
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Transaction'
 *       example:
 *         _id: 5f9d1b9b9c9a9b1b9c9a9b1b
 *         clientId: 5f9d1b9b9c9a9b1b9c9a9b1b
 *         transactionHash: 0x0f9d1b9b9c9a9b1b9c9a9b1b
 *         action: buy
 *         date: 2020-10-30T11:50:00.000Z
 *    '400':
 *     description: <b>Bad Request</b>, with error message.
 *     content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/ErrorMessage'
 *        example:
 *          message: Client id is required.
 *    '404':
 *     description: <b>Not Found</b>, client not found.
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/ErrorMessage'
 *         example:
 *           message: Client with id '5f8b4b5a8e3b9c2b1c4a9c16' not found.
 *    '500':
 *     description: <b>Internal Server Error</b>, with error message.
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/ErrorMessage'
 *         example:
 *           message: Internal Server Error.
 */
const transactionsReadOne = function (req, res) {
    Transaction.findById(req.params.transactionId).exec(function (err, transaction) {
        if (err) {
        res.status(404).json(err);
        } else {
        res.status(200).json(transaction);
        }
    });
}

/**
 * @openapi
 *  /transactions/{transactionId}:
 *    put:
 *      summary: Update transaction by id.
 *      description: Update transaction by id.
 *      tags: [Transaction]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - in: path
 *          name: transactionId
 *          schema:
 *            type: string
 *          required: true
 *          description: Unique identifier of the transaction.
 *          example: 5f9b2b3b9c4b0e2a3c8b4567
 *      requestBody:
 *        description: Transaction object that needs to be updated.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Transaction'
 *            example:
 *              clientId: 5f9d1b9b9c9a9b1b9c9a9b1b
 *      responses:
 *        '200':
 *          description: <b>OK</b>, a successful response.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Transaction'
 *              example:
 *                _id: 5f9b2b3b9c4b0e2a3c8b4567
 *                clientId: 5f9d1b9b9c9a9b1b9c9a9b1b
 *                ethAddress: 0x0f9d1b9b9c9a9b1b9c9a9b1b
 *                transactionHash: 0x0f9d1b9b9c9a9b1b9c9a9b1b
 *                action: buy
 *        '400':
 *          description: <b>Bad Request</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                  message: Client id is required.
 *        '401':
 *          description: <b>Unauthorized</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                  message: No authorization token was found.
 *        '404':
 *          description: <b>Not Found</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "Clinic with id '5f9b2b3b9c4b0e2a3c8b4567' not found."
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "Internal Server Error."
 */
const transactionsUpdateOne = function (req, res) {
    Transaction.findByIdAndUpdate(
        req.params.transactionId,
        req.body,
        { new: true },
        function (err, transaction) {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(transaction);
        }
        },
    );
}

/**
 * @openapi
 *   /transactions/{transactionId}:
 *    delete:
 *      summary: Delete transaction by id.
 *      description: Delete transaction by id.
 *      tags: [Transaction]
 *      security:
 *        - jwt: []
 *      parameters:
 *        - in: path
 *          name: transactionId
 *          schema:
 *            type: string
 *          required: true
 *          description: Unique identifier of the transaction.
 *          example: 5f9b2b3b9c4b0e2a3c8b4567
 *      responses:
 *        '204':
 *          description: <b>No Content</b>, successful response.
 *        '400':
 *          description: <b>Bad Request</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: Client id is required.
 *        '401':
 *          description: <b>Unauthorized</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: No authorization token was found.
 *        '404':
 *          description: <b>Not Found</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "Client with id '5f9b2b3b9c4b0e2a3c8b4567' not found."
 *        '500':
 *          description: <b>Internal Server Error</b>, with error message.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorMessage'
 *              example:
 *                message: "Internal Server Error."
 */
const transactionsDeleteOne = function (req, res) {
    Transaction.findByIdAndRemove(req.params.transactionId, function (err, transaction) {
        if (err) {
        res.status(404).json(err);
        } else {
        res.status(204).json();
        }
    });
}

module.exports = {
    transactionsReadAll,
    transactionsAddOne,
    transactionsReadOne,
    transactionsUpdateOne,
    transactionsDeleteOne,
};