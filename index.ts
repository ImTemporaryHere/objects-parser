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
  constructor(
    private _objectTobeParsed: object | null,
    private _path: string[],
    private _identifierPath?: string[],
    private _returnOnlyObjectWithIdentifier?: boolean
  ) {}

  private _arrayOfValues: any[] = []


  private getResultArray(): Array<parsedValue|parsedValueWithIdentifier|object> {
    if(this._identifierPath) {
      return this.handlePathWithIdentifier()
    }

    if(this._path.includes('[]')) {
      return this.handlePathWithArrays(this._path)
    }

    if(this._path.length === 1) {

      if(this._path[0] === '[0]') {
        this._arrayOfValues.push(this._objectTobeParsed[0])
        return this._arrayOfValues
      }

      this._arrayOfValues.push(this._objectTobeParsed[this._path[0]])
      return this._arrayOfValues
    }



    if(this._returnOnlyObjectWithIdentifier) {
      return [this._objectTobeParsed]
    }

    this.goNextStepInPath(this._path[0])
    if(!this._objectTobeParsed) {
      return this._arrayOfValues
    }
    this._path = this._path.slice(1)

    return this.getResultArray()
  }


  private handlePathWithIdentifier (): parsedValueWithIdentifier[] {
    if(this._identifierPath.includes('[]')) {

      const identifiedObjectsToBeParsed = this.handlePathWithArrays(this._identifierPath, true)

      const identifierPath = this._identifierPath.join('.').split('.[].').pop()

      const pathToParameterValue = this._path.join('.').split('.[].').pop()


      return identifiedObjectsToBeParsed.map((identifiedObject)=>{

        const identifier = ObjectsParserByPath.getArrayOfValues({
          objectTobeParsed:identifiedObject,
          path: identifierPath
        })[0] as string


        const parameterValue = ObjectsParserByPath.getArrayOfValues({
          objectTobeParsed:identifiedObject,
          path: pathToParameterValue
        })[0] as parsedValue


        const object:parsedValueWithIdentifier = {
          identifier,
          parameterValue
        }

        return object


      })
    }

    const identifierPath = this._identifierPath.join('.')

    const pathToParameterValue = this._path.join('.')

    const identifier = ObjectsParserByPath.getArrayOfValues({
      objectTobeParsed: this._objectTobeParsed,
      path: identifierPath
    })[0] as string


    const parameterValues = ObjectsParserByPath.getArrayOfValues({
      objectTobeParsed: this._objectTobeParsed,
      path: pathToParameterValue
    }) as parsedValue[]

    return parameterValues.map((parameterValue)=>{

      const object:parsedValueWithIdentifier = {
        identifier,
        parameterValue
      }

      return object
    })

  }


  private handlePathWithArrays (_path: string[], returnOnlyIdentifiedObject?: boolean) {

    const pathToArray = _path.join('.').split('.[].')[0]

    pathToArray.split('.').forEach(partOfPath=>{

      this.goNextStepInPath(partOfPath)
    });

    (this._objectTobeParsed as Array<any>).forEach((objectInArray)=>{
      const path = _path.join('.').split('.[].').slice(1).join('.[].')
      const values = ObjectsParserByPath.getArrayOfValues({objectTobeParsed: objectInArray, path, returnOnlyIdentifiedObject})
      this._arrayOfValues.push(...values)
    })

    return this._arrayOfValues
  }


  private goNextStepInPath (key:string) {

    if(this._objectTobeParsed[key]) {
      this._objectTobeParsed = this._objectTobeParsed[key]
    }
    else this._objectTobeParsed = null

  }
  
  
  static getArrayOfValues(args: IGetArrayOfValuesArguments): Array<parsedValue|parsedValueWithIdentifier|object>{
    const { objectTobeParsed, path, identifierPath,returnOnlyIdentifiedObject } = args;

    return new ObjectsParserByPath(
      objectTobeParsed,
      path.split('.'),
      identifierPath?.split('.'),
      returnOnlyIdentifiedObject
    ).getResultArray();
  }
}

interface IGetArrayOfValuesArguments {
  objectTobeParsed: object;
  path: string;
  identifierPath?: string,
  returnOnlyIdentifiedObject?: boolean
}

type parsedValue = string|boolean|number
type parsedValueWithIdentifier = {
  identifier: string|number
  parameterValue: parsedValue
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
}



const checkParamInQuoteItemPath = 'quoteItem.[].productOffering.id';
const exptectedResult = `["48b2e652-946a-461c-9b30-886bf9769586","6c7a0934-d4a8-4ed4-9b80-15ac5072548f"]`

const arrayOfValues = ObjectsParserByPath.getArrayOfValues({
  objectTobeParsed: responseAfterPatch,
  path: checkParamInQuoteItemPath,
});

console.log(JSON.stringify(arrayOfValues) === exptectedResult ? 'passed': 'failed ' + exptectedResult)




const checkParamInQuoteItemPathToState = 'quoteItem.[].state';

const identifierPath = 'quoteItem.[].productOffering.id'

const exptectedResult2 = `[{"identifier":"48b2e652-946a-461c-9b30-886bf9769586","parameterValue":"QUALIFIED"},{"identifier":"6c7a0934-d4a8-4ed4-9b80-15ac5072548f","parameterValue":"QUALIFIED"}]`

const arrayOfValues2 = ObjectsParserByPath.getArrayOfValues({
  objectTobeParsed: responseAfterPatch,
  path: checkParamInQuoteItemPathToState,
  identifierPath
});

console.log(JSON.stringify(arrayOfValues2)=== exptectedResult2 ? 'passed': 'failed ' + exptectedResult)





const checkParamInQuotePath = 'id';
const exptectedResult3 = `["569d1f0d-7987-4069-b518-ae3f0bc8baa0"]`

const arrayOfValues3 = ObjectsParserByPath.getArrayOfValues({
  objectTobeParsed: responseAfterPatch,
  path: checkParamInQuotePath,
});

console.log(JSON.stringify(arrayOfValues3) === exptectedResult3 ? 'passed': 'failed ' + exptectedResult3)







const checkParamInQuotePathValueInArray = 'quoteItem.[].extendedParameters.externalProductOfferingId.[0]';
const exptectedResult4 = `["test_ta_plan"]`

const arrayOfValues4 = ObjectsParserByPath.getArrayOfValues({
  objectTobeParsed: responseAfterPatch,
  path: checkParamInQuotePathValueInArray,
});

console.log(JSON.stringify(arrayOfValues4) === exptectedResult4 ? 'passed': 'failed ' + exptectedResult4)





const checkParamInQuoteItemPathToState2 = 'quoteItem.[].state';

const identifierPath2 = 'state';

const exptectedResult6 = `[{"identifier":"IN_PROGRESS","parameterValue":"QUALIFIED"},{"identifier":"IN_PROGRESS","parameterValue":"QUALIFIED"}]`

const arrayOfValues6 = ObjectsParserByPath.getArrayOfValues({
  objectTobeParsed: responseAfterPatch,
  path: checkParamInQuoteItemPathToState2,
  identifierPath: identifierPath2
});

console.log(JSON.stringify(arrayOfValues6)  === exptectedResult6 ? 'passed': 'failed ' + exptectedResult6)







const checkParamInQuoteItemPathToState3 = 'state';

const identifierPath3 = 'id';

const exptectedResult7 = `[{"identifier":"569d1f0d-7987-4069-b518-ae3f0bc8baa0","parameterValue":"IN_PROGRESS"}]`

const arrayOfValues7 = ObjectsParserByPath.getArrayOfValues({
  objectTobeParsed: responseAfterPatch,
  path: checkParamInQuoteItemPathToState3,
  identifierPath: identifierPath3
});

console.log(JSON.stringify(arrayOfValues7)  === exptectedResult7 ? 'passed': 'failed ' + exptectedResult7)