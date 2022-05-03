"use strict";

const crypto = require("crypto");
const OAuth = require("oauth-1.0a");
const fetch = require("fetch");

module.exports = class RequestService {
    /**
     * Constructor
     *
     * @param options {Object}   config object holding tba credentials
     * @param method {string}   Method to be used (GET, POST, PUT, DELETE)
     * @param url {string}      Rest endpoint
     * @param ck {string}       Consumer Key
     * @param cs {string}       Consumer Secret
     * @param tId {string}      Token ID
     * @param ts {string}       Token Secret
     * @param realm {string     Netsuite Account in the form of #####_SB1 or #####
     * @returns
     * @constructor
     */
    constructor(options) {
        const {
            method,
            url,
            consumerKey,
            consumerSecret,
            tokenId,
            tokenSecret,
            accountId
        } = options;

        try {
            if (!method)
                throw new Error(
                    "Invalid Method, only allowed GET, PUT, POST, DELETE"
                );
            if (!url) throw new Error("Invalid URL");
            if (!consumerKey || !consumerSecret || !tokenId || !tokenSecret)
                throw new Error("Invalid Tokens");
            if (!accountId)
                throw new Error(
                    "Account must not be empty, it should be in the form of #####_SB# or ######"
                );

            this.method = method;
            this.url = url;
            this.ck = consumerKey;
            this.cs = consumerSecret;
            this.tId = tokenId;
            this.ts = tokenSecret;
            this.realm = accountId;
        } catch (error) {
            throw error;
        }
    }

    oauth = () => {
        return OAuth({
            consumer: {
                key: this.ck,
                secret: this.cs
            },
            signature_method: "HMAC-SHA256",
            hash_function(base_string, key) {
                return crypto
                    .createHmac("sha256", key)
                    .update(base_string)
                    .digest("base64");
            }
        });
    };

    token = () => {
        return { key: this.tId, secret: this.ts };
    };

    requestNetsuite = async options => {
        try {
        } catch (e) {
            console.error(`FAILED TO FETCH DATA: ${e}`);
        }
    };
};
