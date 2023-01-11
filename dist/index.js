// function checkValueInObjectByPath(
//   objectToBeParsed: object,
//   path: string[],
//   expectedValue: any
// ): boolean {
//   // console.log(
//   //   'objectToBeParsed -',
//   //   JSON.stringify(objectToBeParsed),
//   //   '\n',
//   //   'path -',
//   //   JSON.stringify(path),
//   //   '\n',
//   //   expectedValue
//   // );
//   if (path.length === 1) {
//     if (objectToBeParsed[path[0]] === expectedValue) {
//       return true;
//     }
//     return false;
//   }
//   if (path[1] === '[]') {
//     if (path.length === 2) {
//       // look for exptected value in array
//       if ((objectToBeParsed[path[0]] as Array<any>).includes(expectedValue)) {
//         return true;
//       }
//       return false;
//     }
//     for (const nestedObject of objectToBeParsed[path[0]] as Array<any>) {
//       if (
//         checkValueInObjectByPath(nestedObject, path.slice(2), expectedValue)
//       ) {
//         return true;
//       }
//     }
//     return false;
//   }
//   return checkValueInObjectByPath(
//     objectToBeParsed[path[0]],
//     path.slice(1),
//     expectedValue
//   );
// }
// 'asdf.qwer.[].qqqq.lolo.[].aooo.aaa'
// 'quoteItem.[].productOffering.id'
// 'quoteItem.[].productOffering.id.[0]'
class ObjectsParserByPath {
    constructor(_objectTobeParsed, _path, _identifierPath, _returnOnlyObjectWithIdentifier) {
        this._objectTobeParsed = _objectTobeParsed;
        this._path = _path;
        this._identifierPath = _identifierPath;
        this._returnOnlyObjectWithIdentifier = _returnOnlyObjectWithIdentifier;
        this._arrayOfValues = [];
    }
    getResultArray() {
        if (this._identifierPath) {
            return this.handlePathWithIdentifier();
        }
        if (this._path.includes('[]')) {
            return this.handlePathWithArrays(this._path);
        }
        if (this._path.length === 1) {
            const regexpMatch = this._path[0].match(/\[(.+)\]/);
            if (regexpMatch) {
                // console.log(regexpMatch)
                this._arrayOfValues.push(this._objectTobeParsed[regexpMatch[1]]);
                return this._arrayOfValues;
            }
            this._arrayOfValues.push(this._objectTobeParsed[this._path[0]]);
            return this._arrayOfValues;
        }
        if (this._returnOnlyObjectWithIdentifier) {
            return [this._objectTobeParsed];
        }
        const regexpMatch = this._path[0].match(/\[(.+)\]/);
        if (regexpMatch) {
            // console.log(regexpMatch)
            this.goNextStepInPath(regexpMatch[1]);
        }
        else {
            this.goNextStepInPath(this._path[0]);
        }
        if (!this._objectTobeParsed) {
            return this._arrayOfValues;
        }
        this._path = this._path.slice(1);
        return this.getResultArray();
    }
    handlePathWithIdentifier() {
        if (this._identifierPath.includes('[]')) {
            const identifiedObjectsToBeParsed = this.handlePathWithArrays(this._identifierPath, true);
            const identifierPath = this._identifierPath.join('.').split('.[].').pop();
            const pathToParameterValue = this._path.join('.').split('.[].').pop();
            return identifiedObjectsToBeParsed.map((identifiedObject) => {
                const identifier = ObjectsParserByPath.getArrayOfValues({
                    objectTobeParsed: identifiedObject,
                    path: identifierPath
                })[0];
                const parameterValue = ObjectsParserByPath.getArrayOfValues({
                    objectTobeParsed: identifiedObject,
                    path: pathToParameterValue
                })[0];
                const object = {
                    identifier,
                    parameterValue
                };
                return object;
            });
        }
        const identifierPath = this._identifierPath.join('.');
        const pathToParameterValue = this._path.join('.');
        const identifier = ObjectsParserByPath.getArrayOfValues({
            objectTobeParsed: this._objectTobeParsed,
            path: identifierPath
        })[0];
        const parameterValues = ObjectsParserByPath.getArrayOfValues({
            objectTobeParsed: this._objectTobeParsed,
            path: pathToParameterValue
        });
        return parameterValues.map((parameterValue) => {
            const object = {
                identifier,
                parameterValue
            };
            return object;
        });
    }
    handlePathWithArrays(_path, returnOnlyIdentifiedObject) {
        const pathToArray = _path.join('.').split('.[].')[0];
        pathToArray.split('.').forEach(partOfPath => {
            this.goNextStepInPath(partOfPath);
        });
        this._objectTobeParsed.forEach((objectInArray) => {
            const path = _path.join('.').split('.[].').slice(1).join('.[].');
            const values = ObjectsParserByPath.getArrayOfValues({ objectTobeParsed: objectInArray, path, returnOnlyIdentifiedObject });
            this._arrayOfValues.push(...values);
        });
        return this._arrayOfValues;
    }
    goNextStepInPath(key) {
        if (this._objectTobeParsed[key]) {
            this._objectTobeParsed = this._objectTobeParsed[key];
        }
        else
            this._objectTobeParsed = null;
    }
    static getArrayOfValues(args) {
        const { objectTobeParsed, path, identifierPath, returnOnlyIdentifiedObject } = args;
        return new ObjectsParserByPath(objectTobeParsed, path.split('.'), identifierPath?.split('.'), returnOnlyIdentifiedObject).getResultArray();
    }
}
const responseAfterPatch = {
    "href": "https://public-gateway-cloud-bss-is03.nc-gke-st.tsl.telus.com/quote-tmf-service/quoteManagement/quote/569d1f0d-7987-4069-b518-ae3f0bc8baa0",
    "id": "569d1f0d-7987-4069-b518-ae3f0bc8baa0",
    "expirationDate": "2023-03-21T08:47:54.502841233Z",
    "version": "15",
    "number": "4504",
    "category": "Residential Customers",
    "state": "IN_PROGRESS",
    "quoteDate": "2022-12-21T08:47:54.502841233Z",
    "validFor": {
        "startDateTime": "2022-12-21T08:47:54.502841233Z",
        "endDateTime": "2023-03-21T08:47:54.502841233Z"
    },
    "relatedParty": [
        {
            "id": "taemailCCYxyrR_RgjHCVa@telus.com",
            "role": "Customer",
            "name": "TestSZRSWJG TaLHQWBNQ",
            "@type": "Customer"
        }
    ],
    "quoteItem": [
        {
            "id": "b47189d8-0fa1-4439-8466-bcd18d80281e",
            "state": "QUALIFIED",
            "quantity": 1,
            "action": "ADD",
            "productOffering": {
                "id": "48b2e652-946a-461c-9b30-886bf9769586",
                "href": "https://public-gateway-cloud-bss-is03.nc-gke-st.tsl.telus.com/catalog-integration-tmf/catalogManagement/productOffering/48b2e652-946a-461c-9b30-886bf9769586",
                "name": "Mobility Prepaid (TLO)",
                "@type": "ProductOffering"
            },
            "quoteItemPrice": [
                {
                    "priceType": "Total RC",
                    "name": "Total RC by Quote Item",
                    "price": {
                        "@type": "Price"
                    },
                    "@type": "QuotePrice"
                },
                {
                    "priceType": "Total NRC",
                    "name": "Total NRC by Quote Item",
                    "price": {
                        "@type": "Price"
                    },
                    "@type": "QuotePrice"
                }
            ],
            "product": {
                "name": "Mobility Prepaid (TLO) #1",
                "characteristic": [],
                "productSpecification": {
                    "id": "96d8ff89-3c79-4483-bc0b-47b59ab74d53",
                    "href": "https://public-gateway-cloud-bss-is03.nc-gke-st.tsl.telus.com/catalog-integration-tmf/catalogManagement/productOffering/48b2e652-946a-461c-9b30-886bf9769586",
                    "version": "0.2",
                    "name": "Mobility Prepaid (PS)",
                    "@type": "ProductSpecification"
                }
            },
            "quoteItemType": "Product offering",
            "rootQuoteItemId": "b47189d8-0fa1-4439-8466-bcd18d80281e",
            "marketId": "9fd4ad80-38fd-472c-9526-91b1e08d2faf",
            "distributionChannelId": "PERMIT",
            "extendedParameters": {
                "transactionType": [
                    "Enroll"
                ],
                "externalProductOfferingId": [
                    "test_ta_plan"
                ],
                "hierarchyUnrolled": [
                    "true"
                ]
            },
            "businessAction": "Enroll",
            "creationTime": "2022-12-21T08:47:54.812946959Z",
            "overrideMode": "NET",
            "isOneTimeOffering": false,
            "@type": "QuoteItem"
        },
        {
            "action": "ADD",
            "marketId": "9fd4ad80-38fd-472c-9526-91b1e08d2faf",
            "distributionChannelId": "PERMIT",
            "quantity": 1,
            "state": "QUALIFIED",
            "product": {
                "characteristic": [
                    {
                        "id": "15b8edfc-25e6-4598-8c56-ee1f008a1ae4",
                        "rawValue": [
                            "Yes"
                        ]
                    }
                ],
                "place": [
                    {
                        "address": "123-637 Lake Shore Blvd W, TORONTO ON M5V 3J6, CANADA",
                        "externalId": "9162808454618473664",
                        "marketId": "9fd4ad80-38fd-472c-9526-91b1e08d2faf",
                        "name": "My Place",
                        "role": "customerLocation",
                        "extendedParameters": {
                            "requestedDeliveryDate": [
                                "2022-09-30T18:06:05.630774178Z"
                            ],
                            "additionalCustomerName": [
                                "Additional name for Customer"
                            ],
                            "telephoneNumber": [
                                "+55 34 99100-1234"
                            ],
                            "shipmentNotes": [
                                "Call customer with one day notification"
                            ],
                            "cityName": [
                                "Vancouver"
                            ],
                            "provinceCode": [
                                "BC"
                            ],
                            "postalCode": [
                                "X7V 2P4"
                            ]
                        }
                    }
                ]
            },
            "productOffering": {
                "id": "6c7a0934-d4a8-4ed4-9b80-15ac5072548f"
            },
            "quoteItemType": "Product offering",
            "parentQuoteItemId": "b47189d8-0fa1-4439-8466-bcd18d80281e",
            "rootQuoteItemId": "b47189d8-0fa1-4439-8466-bcd18d80281e"
        }
    ],
    "quoteTotalPrice": [
        {
            "priceType": "Total NRC",
            "name": "Total NRC by Quote",
            "price": {
                "taxIncludedAmount": "0.00",
                "dutyFreeAmount": "0.00",
                "valueExcludingTaxRounded": "0.00",
                "valueIncludingTaxRounded": "0.00",
                "@type": "Price"
            },
            "@type": "QuotePrice"
        },
        {
            "priceType": "Total NRC Tax",
            "name": "Total NRC Tax by Quote",
            "price": {
                "taxIncludedAmount": "0.00",
                "valueIncludingTaxRounded": "0.00",
                "@type": "Price"
            },
            "@type": "QuotePrice"
        },
        {
            "priceType": "Total NRC Reduction",
            "name": "Total NRC Reduction by Quote",
            "price": {
                "taxIncludedAmount": "0.00",
                "dutyFreeAmount": "0.00",
                "valueExcludingTaxRounded": "0.00",
                "valueIncludingTaxRounded": "0.00",
                "@type": "Price"
            },
            "@type": "QuotePrice"
        },
        {
            "priceType": "Total RC",
            "name": "Total RC by Quote",
            "price": {
                "taxIncludedAmount": "0.00",
                "dutyFreeAmount": "0.00",
                "valueExcludingTaxRounded": "0.00",
                "valueIncludingTaxRounded": "0.00",
                "@type": "Price"
            },
            "@type": "QuotePrice"
        },
        {
            "priceType": "Total RC Tax",
            "name": "Total RC Tax by Quote",
            "price": {
                "taxIncludedAmount": "0.00",
                "valueIncludingTaxRounded": "0.00",
                "@type": "Price"
            },
            "@type": "QuotePrice"
        },
        {
            "priceType": "Total RC Reduction",
            "name": "Total RC Reduction by Quote",
            "price": {
                "taxIncludedAmount": "0.00",
                "dutyFreeAmount": "0.00",
                "valueExcludingTaxRounded": "0.00",
                "valueIncludingTaxRounded": "0.00",
                "@type": "Price"
            },
            "@type": "QuotePrice"
        },
        {
            "priceType": "Total Deactivation Fee",
            "name": "Total Deactivation Fee by Quote",
            "price": {
                "taxIncludedAmount": "0.00",
                "dutyFreeAmount": "0.00",
                "valueExcludingTaxRounded": "0.00",
                "valueIncludingTaxRounded": "0.00",
                "@type": "Price"
            },
            "@type": "QuotePrice"
        },
        {
            "priceType": "Total Deactivation Fee Tax",
            "name": "Total Deactivation Fee Tax by Quote",
            "price": {
                "taxIncludedAmount": "0.00",
                "valueIncludingTaxRounded": "0.00",
                "@type": "Price"
            },
            "@type": "QuotePrice"
        }
    ],
    "customerCategory": "a88bb5d3-9064-ae45-ff6d-1c30709b26ef",
    "customerId": "taemailCCYxyrR_RgjHCVa@telus.com",
    "distributionChannelId": "PERMIT",
    "initialDistributionChannelId": "PERMIT",
    "newMSA": false,
    "distributionChannelName": "CSR",
    "name": "Quote #4504",
    "revision": 0,
    "updatedWhen": "2022-12-21T08:47:54.836140059Z",
    "overrideMode": "catalogDriven",
    "approvalLevel": 0,
    "alertItems": [
        {
            "id": "0d805f1a-0f71-4bc0-80ff-d845ad0eb344",
            "ruleId": "IneligiblePO001",
            "refType": "productItem",
            "refId": "b47189d8-0fa1-4439-8466-bcd18d80281e",
            "alertLevel": "warning",
            "alertType": "eligibility",
            "ruleType": "custom",
            "alertDomain": "UI",
            "message": {
                "code": "M-0045",
                "defaultMessage": "This Offering is ineligible for selling"
            }
        }
    ],
    "extendedParameters": {
        "transaction-family": [
            "WLS"
        ],
        "newCustomer": [
            "Yes"
        ],
        "customerCategoryHierarchyUUIDs": [
            "a88bb5d3-9064-ae45-ff6d-1c30709b26ef,72d6fb2d-f64c-a9dc-bf03-e109ee914b13"
        ],
        "newFixedCustomer": [
            "Yes"
        ]
    },
    "productOfferingRefByMarketRefs": [
        {
            "marketId": "9fd4ad80-38fd-472c-9526-91b1e08d2faf",
            "productOfferingId": "48b2e652-946a-461c-9b30-886bf9769586",
            "pricesByOffering": [
                {
                    "priceType": "Sub-Total RC",
                    "name": "Sub-Total RC by Product",
                    "price": {
                        "@type": "Price"
                    },
                    "@type": "QuotePrice"
                },
                {
                    "priceType": "Sub-Total NRC",
                    "name": "Sub-Total NRC by Product",
                    "price": {
                        "@type": "Price"
                    },
                    "@type": "QuotePrice"
                },
                {
                    "priceType": "Total RC",
                    "name": "Total RC by Product",
                    "price": {
                        "@type": "Price"
                    },
                    "@type": "QuotePrice"
                },
                {
                    "priceType": "Total NRC",
                    "name": "Total NRC by Product",
                    "price": {
                        "@type": "Price"
                    },
                    "@type": "QuotePrice"
                }
            ]
        }
    ],
    "marketRefs": [
        {
            "marketId": "9fd4ad80-38fd-472c-9526-91b1e08d2faf",
            "marketName": "Canada"
        }
    ],
    "brandId": "76be5e93-8744-4cde-96c0-6655fc0f8599",
    "initialBaselineQuoteId": "569d1f0d-7987-4069-b518-ae3f0bc8baa0",
    "createdBy": {
        "id": "c5073f71-438e-4f46-a727-252e9beb30bc",
        "name": "cpq-admin@netcracker.com",
        "@referredType": "User"
    }
};
const checkParamInQuoteItemPath = 'quoteItem.[].productOffering.id';
const exptectedResult = `["48b2e652-946a-461c-9b30-886bf9769586","6c7a0934-d4a8-4ed4-9b80-15ac5072548f"]`;
const arrayOfValues = ObjectsParserByPath.getArrayOfValues({
    objectTobeParsed: responseAfterPatch,
    path: checkParamInQuoteItemPath,
});
console.log(JSON.stringify(arrayOfValues) === exptectedResult ? 'passed' : 'failed ' + exptectedResult);
const checkParamInQuoteItemPathToState = 'quoteItem.[].state';
const identifierPath = 'quoteItem.[].productOffering.id';
const exptectedResult2 = `[{"identifier":"48b2e652-946a-461c-9b30-886bf9769586","parameterValue":"QUALIFIED"},{"identifier":"6c7a0934-d4a8-4ed4-9b80-15ac5072548f","parameterValue":"QUALIFIED"}]`;
const arrayOfValues2 = ObjectsParserByPath.getArrayOfValues({
    objectTobeParsed: responseAfterPatch,
    path: checkParamInQuoteItemPathToState,
    identifierPath
});
console.log(JSON.stringify(arrayOfValues2) === exptectedResult2 ? 'passed' : 'failed ' + exptectedResult);
const checkParamInQuotePath = 'id';
const exptectedResult3 = `["569d1f0d-7987-4069-b518-ae3f0bc8baa0"]`;
const arrayOfValues3 = ObjectsParserByPath.getArrayOfValues({
    objectTobeParsed: responseAfterPatch,
    path: checkParamInQuotePath,
});
console.log(JSON.stringify(arrayOfValues3) === exptectedResult3 ? 'passed' : 'failed ' + exptectedResult3);
const checkParamInQuotePathValueInArray = 'quoteItem.[].extendedParameters.externalProductOfferingId.[0]';
const exptectedResult4 = `["test_ta_plan"]`;
const arrayOfValues4 = ObjectsParserByPath.getArrayOfValues({
    objectTobeParsed: responseAfterPatch,
    path: checkParamInQuotePathValueInArray,
});
console.log(JSON.stringify(arrayOfValues4) === exptectedResult4 ? 'passed' : 'failed ' + exptectedResult4);
const checkParamInQuoteItemPathToState2 = 'quoteItem.[].state';
const identifierPath2 = 'state';
const exptectedResult6 = `[{"identifier":"IN_PROGRESS","parameterValue":"QUALIFIED"},{"identifier":"IN_PROGRESS","parameterValue":"QUALIFIED"}]`;
const arrayOfValues6 = ObjectsParserByPath.getArrayOfValues({
    objectTobeParsed: responseAfterPatch,
    path: checkParamInQuoteItemPathToState2,
    identifierPath: identifierPath2
});
console.log(JSON.stringify(arrayOfValues6) === exptectedResult6 ? 'passed' : 'failed ' + exptectedResult6);
const checkParamInQuoteItemPathToState3 = 'state';
const identifierPath3 = 'id';
const exptectedResult7 = `[{"identifier":"569d1f0d-7987-4069-b518-ae3f0bc8baa0","parameterValue":"IN_PROGRESS"}]`;
const arrayOfValues7 = ObjectsParserByPath.getArrayOfValues({
    objectTobeParsed: responseAfterPatch,
    path: checkParamInQuoteItemPathToState3,
    identifierPath: identifierPath3
});
console.log(JSON.stringify(arrayOfValues7) === exptectedResult7 ? 'passed' : 'failed ' + exptectedResult7);
const responseGetOrderParams = [
    {
        "id": "279fc5b5-6d69-4a20-8fc3-76fb7259fd4c",
        "href": "/productOrderingManagement/v1/productOrder/279fc5b5-6d69-4a20-8fc3-76fb7259fd4c",
        "externalId": "fbd94ba0-dff5-41c5-bbb0-d8e6fce53466",
        "category": "Residential Customers",
        "state": "completed",
        "orderDate": "2023-01-10T17:32:26.697+00:00",
        "startDate": "2023-01-10T17:32:26.824+00:00",
        "completionDate": "2023-01-10T17:32:31.180+00:00",
        "expectedCompletionDate": "2023-01-10T17:32:26.824+00:00",
        "ponrPassed": true,
        "ponrState": "modificationPonr",
        "channel": [
            {
                "id": "PERMIT",
                "role": "initChannel"
            }
        ],
        "relatedParty": [
            {
                "id": "taemailnCxqwgI_ZqWLMjf@telus.com",
                "name": "TestNPGXHNL TaEHQTQZY",
                "role": "Customer",
                "@referredType": "Customer"
            }
        ],
        "orderTotalPrice": [
            {
                "name": "Total NRC by Quote",
                "priceType": "Total NRC",
                "price": {
                    "taxIncludedAmount": "0.00",
                    "dutyFreeAmount": "0.00"
                },
                "@type": "QuotePrice"
            },
            {
                "name": "Total RC Tax by Quote",
                "priceType": "Total RC Tax",
                "price": {
                    "taxIncludedAmount": "0.00"
                },
                "@type": "QuotePrice"
            },
            {
                "name": "Total RC by Quote",
                "priceType": "Total RC",
                "price": {
                    "taxIncludedAmount": "0.00",
                    "dutyFreeAmount": "0.00"
                },
                "@type": "QuotePrice"
            },
            {
                "name": "Total RC Reduction by Quote",
                "priceType": "Total RC Reduction",
                "price": {
                    "taxIncludedAmount": "0.00",
                    "dutyFreeAmount": "0.00"
                },
                "@type": "QuotePrice"
            },
            {
                "name": "Total Deactivation Fee by Quote",
                "priceType": "Total Deactivation Fee",
                "price": {
                    "taxIncludedAmount": "0.00",
                    "dutyFreeAmount": "0.00"
                },
                "@type": "QuotePrice"
            },
            {
                "name": "Total NRC Reduction by Quote",
                "priceType": "Total NRC Reduction",
                "price": {
                    "taxIncludedAmount": "0.00",
                    "dutyFreeAmount": "0.00"
                },
                "@type": "QuotePrice"
            },
            {
                "name": "Total Deactivation Fee Tax by Quote",
                "priceType": "Total Deactivation Fee Tax",
                "price": {
                    "taxIncludedAmount": "0.00"
                },
                "@type": "QuotePrice"
            },
            {
                "name": "Total NRC Tax by Quote",
                "priceType": "Total NRC Tax",
                "price": {
                    "taxIncludedAmount": "0.00"
                },
                "@type": "QuotePrice"
            }
        ],
        "orderItem": [
            {
                "id": "4b4bbc8e-8884-49f8-9901-edae3865cf4b",
                "action": "add",
                "state": "completed",
                "quantity": 1,
                "ponrPassed": true,
                "ponrState": "modificationPonr",
                "itemTotalPrice": [
                    {
                        "name": "Total NRC by Quote Item",
                        "priceType": "Total NRC",
                        "price": {},
                        "@type": "QuotePrice"
                    },
                    {
                        "name": "Total RC by Quote Item",
                        "priceType": "Total RC",
                        "price": {},
                        "@type": "QuotePrice"
                    }
                ],
                "productOffering": {
                    "id": "48b2e652-946a-461c-9b30-886bf9769586",
                    "href": "https://public-gateway-cloud-bss-is03.nc-gke-st.tsl.telus.com/catalog-integration-tmf/catalogManagement/productOffering/48b2e652-946a-461c-9b30-886bf9769586",
                    "name": "Mobility Prepaid (TLO)",
                    "@referredType": "ProductOffering"
                },
                "product": {
                    "id": "4b4bbc8e-8884-49f8-9901-edae3865cf4b",
                    "name": "Mobility Prepaid (TLO) #1",
                    "status": "ACTIVE",
                    "terminationDate": "2023-01-10T17:33:31.064+00:00",
                    "effectiveDate": "2023-01-10T17:32:31.091+00:00",
                    "relatedParty": [
                        {
                            "id": "taemailnCxqwgI_ZqWLMjf@telus.com",
                            "role": "Customer",
                            "@referredType": "Customer"
                        }
                    ],
                    "productSpecification": {
                        "id": "96d8ff89-3c79-4483-bc0b-47b59ab74d53",
                        "href": "https://public-gateway-cloud-bss-is03.nc-gke-st.tsl.telus.com/catalog-integration-tmf/catalogManagement/productOffering/48b2e652-946a-461c-9b30-886bf9769586",
                        "name": "Mobility Prepaid (PS)",
                        "version": "0.2"
                    },
                    "distributionChannelId": "PERMIT",
                    "extendedParameters": {
                        "transactionType": [
                            "Enroll"
                        ],
                        "externalProductOfferingId": [
                            "test_ta_plan"
                        ],
                        "hierarchyUnrolled": [
                            "true"
                        ]
                    },
                    "expirationDate": 1673372011064,
                    "marketId": "9fd4ad80-38fd-472c-9526-91b1e08d2faf"
                },
                "orderItem": [
                    {
                        "id": "6454fc85-7172-4ea9-8059-5aec3e47b8a1",
                        "action": "add",
                        "state": "completed",
                        "quantity": 1,
                        "ponrPassed": true,
                        "ponrState": "modificationPonr",
                        "productOffering": {
                            "id": "220d1870-6743-46bc-810f-3f8122622438",
                            "href": "https://public-gateway-cloud-bss-is03.nc-gke-st.tsl.telus.com/catalog-integration-tmf/catalogManagement/productOffering/220d1870-6743-46bc-810f-3f8122622438",
                            "name": "e-SIM Card",
                            "@referredType": "ProductOffering"
                        },
                        "product": {
                            "id": "6454fc85-7172-4ea9-8059-5aec3e47b8a1",
                            "name": "e-SIM Card (SLO) #1",
                            "status": "COMPLETED",
                            "terminationDate": "2023-01-10T17:33:30.987+00:00",
                            "effectiveDate": "2023-01-10T17:32:31.008+00:00",
                            "characteristic": [
                                {
                                    "name": "[Public] ICCID",
                                    "charSpecId": "05e51f8f-d377-4a05-a7e5-f6d6f96215e7",
                                    "value": [
                                        8912230200156694586
                                    ]
                                },
                                {
                                    "name": "Needs Fulfillment?",
                                    "charSpecId": "7e59eee3-4d77-4cf5-9930-c795cf0da481",
                                    "value": [
                                        "Yes"
                                    ],
                                    "@type": "ProductCharacteristic"
                                },
                                {
                                    "name": "[Public] Activation Code",
                                    "charSpecId": "0fdc5bc0-d23d-4ffd-980d-8f13600963f3",
                                    "value": [
                                        "LPA:1$rsp-1007.oberthur.net$HS6ED-AHIPR-YP7ES-HRDOW"
                                    ]
                                }
                            ],
                            "productSpecification": {
                                "id": "c9c717b5-f61a-4a4d-b70f-df0931f7a1a1",
                                "href": "https://public-gateway-cloud-bss-is03.nc-gke-st.tsl.telus.com/catalog-integration-tmf/catalogManagement/productOffering/220d1870-6743-46bc-810f-3f8122622438",
                                "name": "e-SIM Card (PS)",
                                "version": "0.6"
                            },
                            "distributionChannelId": "PERMIT",
                            "extendedParameters": {
                                "transactionType": [
                                    "Enroll"
                                ],
                                "hierarchyUnrolled": [
                                    "true"
                                ]
                            },
                            "expirationDate": 1673372010987,
                            "marketId": "9fd4ad80-38fd-472c-9526-91b1e08d2faf"
                        },
                        "rootId": "4b4bbc8e-8884-49f8-9901-edae3865cf4b",
                        "sems-eventTime": 1673371950941,
                        "extendedParameters": {
                            "transactionType": [
                                "Enroll"
                            ],
                            "hierarchyUnrolled": [
                                "true"
                            ]
                        },
                        "parentId": "4b4bbc8e-8884-49f8-9901-edae3865cf4b",
                        "overrideMode": "NET"
                    }
                ],
                "rootId": "4b4bbc8e-8884-49f8-9901-edae3865cf4b",
                "extendedParameters": {
                    "transactionType": [
                        "Enroll"
                    ],
                    "externalProductOfferingId": [
                        "test_ta_plan"
                    ],
                    "hierarchyUnrolled": [
                        "true"
                    ]
                },
                "overrideMode": "NET"
            }
        ],
        "orderRelationship": [],
        "quote": [
            {
                "id": "fbd94ba0-dff5-41c5-bbb0-d8e6fce53466",
                "href": "https://public-gateway-cloud-bss-is03.nc-gke-st.tsl.telus.com/quote-tmf-service/quoteManagement/quote/fbd94ba0-dff5-41c5-bbb0-d8e6fce53466",
                "name": "Quote #6445",
                "@referredType": "Quote"
            }
        ],
        "requester_header": "cpq",
        "extendedParameters": {
            "actualQuoteId": [
                "fbd94ba0-dff5-41c5-bbb0-d8e6fce53466"
            ],
            "transaction-family": [
                "WLS"
            ],
            "newCustomer": [
                "Yes"
            ],
            "customerCategoryHierarchyUUIDs": [
                "a88bb5d3-9064-ae45-ff6d-1c30709b26ef,72d6fb2d-f64c-a9dc-bf03-e109ee914b13"
            ],
            "newFixedCustomer": [
                "Yes"
            ]
        },
        "customerId": "taemailnCxqwgI_ZqWLMjf@telus.com",
        "overrideMode": "catalogDriven"
    }
];
const checkParamInQuoteItemPathToState4 = 'quoteItem.[length]';
const exptectedResult8 = `[2]`;
const arrayOfValues8 = ObjectsParserByPath.getArrayOfValues({
    objectTobeParsed: responseAfterPatch,
    path: checkParamInQuoteItemPathToState4,
});
console.log(JSON.stringify(arrayOfValues8) === exptectedResult8 ? 'passed' : 'failed ' + exptectedResult8, arrayOfValues8);
const checkParamInQuoteItemPathToState5 = '[0].orderItem.[0].product.extendedParameters.externalProductOfferingId.[0]';
const exptectedResult9 = `["test_ta_plan"]`;
const arrayOfValues9 = ObjectsParserByPath.getArrayOfValues({
    objectTobeParsed: responseGetOrderParams,
    path: checkParamInQuoteItemPathToState5,
});
console.log(JSON.stringify(arrayOfValues9) === exptectedResult9 ? 'passed' : 'failed ' + exptectedResult9, arrayOfValues9);
