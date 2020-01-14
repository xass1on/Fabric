'use strict';
const shim = require('fabric-shim');
const util = require('util');
const ClientIdentity = require('fabric-shim').ClientIdentity;

var Chaincode = class {
  // Initialize the chaincode
  async Init(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    console.info('========= Blood Test ChainCode Init =========');
    return shim.success();
  }

  async Invoke(stub) {
    console.log('Transaction ID: ' + stub.getTxID())
    console.log(util.format('Args: %j', stub.getArgs()))

    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.log('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }
    try {
      let payload = await method(stub, ret.params, this);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  // ====================================================================
  // addResult - add new Result data
  // ====================================================================
  async addResult(stub, args, thisClass) {
    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }
    // ==== Input sanitation ====
    console.info('--- start init Result ---')
    if (args[0].lenth <= 0) {
      throw new Error('1st argument must be a non-empty string');
    }
    if (args[1].lenth <= 0) {
      throw new Error('2nd argument must be a non-empty string');
    }
    if (args[2].lenth <= 0) {
      throw new Error('3rd argument must be a non-empty string');
    }
    let userName = args[0];
    let userRegistrationNumber = args[1];
    let userResult = args[2].toLowerCase();
    let resultAsbytes = await stub.getState(userName) //get the Result from chaincode state

    // ================== Test Code

    let resJson = {
      test_result: {
        testType: 'blood test',
        userName: 'null',
        userRegistrationNumber: 'null',
        userResult: []
      }
    }

    let userResults = {
      blood_type1: 'null',
      blood_type2: 'null',
      blood_type3: 'null',
      blood_type4: 'null',
      blood_type5: 'null',
      blood_type6: 'null',
      blood_type7: 'null',
      blood_type8: 'null',
      blood_type9: 'null',
      blood_type10: 'null',
      blood_type11: 'null',
      blood_type12: 'null',
      blood_type13: 'null',
      blood_type14: 'null',
      blood_type15: 'null',
      blood_type16: 'null',
      blood_type17: 'null',
      blood_type18: 'null',
      blood_type19: 'null',
      blood_type20: 'null',
      blood_type21: 'null',
      blood_type22: 'null',
      blood_type23: 'null',
      blood_type24: 'null',
      blood_type25: 'null',
      blood_type26: 'null',
      blood_type27: 'null',
      blood_type28: 'null',
      blood_type29: 'null',
      blood_type30: 'null'
    }

    userResults.blood_type1 = args[2].toLowerCase()
    userResults.blood_type2 = args[2].toLowerCase()
    userResults.blood_type3 = args[2].toLowerCase()
    userResults.blood_type4 = args[2].toLowerCase()
    userResults.blood_type5 = args[2].toLowerCase()
    userResults.blood_type6 = args[2].toLowerCase()
    userResults.blood_type7 = args[2].toLowerCase()
    userResults.blood_type8 = args[2].toLowerCase()
    userResults.blood_type9 = args[2].toLowerCase()
    userResults.blood_type10 = args[2].toLowerCase()
    userResults.blood_type11 = args[2].toLowerCase()
    userResults.blood_type12 = args[2].toLowerCase()
    userResults.blood_type13 = args[2].toLowerCase()
    userResults.blood_type14 = args[2].toLowerCase()
    userResults.blood_type15 = args[2].toLowerCase()
    userResults.blood_type16 = args[2].toLowerCase()
    userResults.blood_type17 = args[2].toLowerCase()
    userResults.blood_type18 = args[2].toLowerCase()
    userResults.blood_type19 = args[2].toLowerCase()
    userResults.blood_type20 = args[2].toLowerCase()
    userResults.blood_type21 = args[2].toLowerCase()
    userResults.blood_type22 = args[2].toLowerCase()
    userResults.blood_type23 = args[2].toLowerCase()
    userResults.blood_type24 = args[2].toLowerCase()
    userResults.blood_type25 = args[2].toLowerCase()
    userResults.blood_type26 = args[2].toLowerCase()
    userResults.blood_type27 = args[2].toLowerCase()
    userResults.blood_type28 = args[2].toLowerCase()
    userResults.blood_type29 = args[2].toLowerCase()
    userResults.blood_type30 = args[2].toLowerCase()
    
    try {
      resJson = JSON.parse(resultAsbytes.toString())
      resJson.test_result.userResult.push(userResults)
    } catch (err) {
      resJson.test_result.userName = userName
      resJson.test_result.userRegistrationNumber = userRegistrationNumber
      resJson.test_result.userResult.push(userResults)
    }

    // // =================== Final Code
    // let resJson = {
    //   test_result: {
    //     testType: 'blood test',
    //     userName: 'null',
    //     userRegistrationNumber: 'null',
    //     userResult: []
    //   }
    // }

    // try {
    //   resJson = JSON.parse(resultAsbytes.toString())
    //   resJson.test_result.userResult.push(userResult)
    // } catch (err) {
    //   resJson.test_result.userName = userName
    //   resJson.test_result.userRegistrationNumber = userRegistrationNumber
    //   resJson.test_result.userResult.push(userResult)
    // }

    // =========================== Working code sample
    // let resJson = {
    //   test_results: []
    // }
    // try {
    //   resJson = JSON.parse(resultAsbytes.toString())
    // } catch (err) {
    //   resJson.test_results = []
    // }
    // resJson.test_results.push(test_result)

    // ========== Add test result to state ==========
    await stub.putState(userName, Buffer.from(JSON.stringify(resJson)))
    let indexName = 'userName'
    let indexKey = await stub.createCompositeKey(indexName, [userName])
    console.info(indexKey);
    //  Save index entry to state. Only the key name is needed, no need to store a duplicate copy of the Result.
    //  Note - passing a 'nil' value will effectively delete the key from state, therefore we pass null character as value
    await stub.putState(indexKey, Buffer.from('\u0000'))
    console.info('- end init blood test')
  }

  // ===============================================
  // readResult - read a Result from chaincode state
  // ===============================================
  async readResult(stub, args, thisClass) {
    let cid = new ClientIdentity(stub);
    let userName = args[0];

    if (cid.assertAttributeValue('hf.Affiliation', 'datascience.jamuha') == false) {
      throw new Error('Only people from DataScience Jamuha can read test results')
    }
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting user name of the Result to query');
    }
    if (!userName) {
      throw new Error('User name must not be empty');
    }

    try {
      let resultAsbytes = await stub.getState(userName); //get the Result from chaincode state
      return resultAsbytes;
    } catch (err) {
      let jsonResp = {};
      jsonResp.Error = 'Result does not exist: ' + userName;
      throw new Error(JSON.stringify(jsonResp));
    }
  }

  // ===============================================
  // readResult - read a Result from chaincode state
  // ===============================================
  readResult2(stub, args, thisClass) {
    return new Promise(async (resolve, reject) => {
      let cid = new ClientIdentity(stub)
      let method = thisClass['putLogs2']
      let userName = args[0];

      if (cid.assertAttributeValue('hf.Affiliation', 'datascience.jamuha') === false) {
        args[2] = 'false'
        try {
          await method(stub, args)
          resolve(`Only DataScience Jamuha can access permitted data`)
        } catch (err) {
          reject(new Error(`Error: ${err.message}`))
        }
      }

      try {
        if (!userName) {
          reject(new Error('User name must not be empty'))
        }
        let resultAsbytes = await stub.getState(userName); //get the Result from chaincode state
        if (!resultAsbytes.toString()) {
          let jsonResp = {};
          jsonResp.Error = 'Result does not exist: ' + userName;
          reject(new Error(JSON.stringify(jsonResp)))
        }

        await method(stub, args)
        console.info('=======================================');
        console.log(resultAsbytes.toString());
        console.info('=======================================');
        resolve(resultAsbytes)
      } catch (err) {
        reject(err)
      }
    })
  }

  // ==================================================
  // delete - remove a result key/value pair from state
  // ==================================================
  async delete(stub, args, thisClass) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting user name of the result to delete');
    }
    let userName = args[0];
    if (!userName) {
      throw new Error('user name must not be empty');
    }

    let valAsbytes = await stub.getState(userName);
    let jsonResp = {};
    if (!valAsbytes) {
      jsonResp.error = 'user name does not exist: ' + name;
      throw new Error(jsonResp);
    }
    let resultJSON = {};
    try {
      resultJSON = JSON.parse(valAsbytes.toString());
    } catch (err) {
      jsonResp = {};
      jsonResp.error = 'Failed to decode JSON of: ' + userName;
      throw new Error(jsonResp);
    }

    await stub.deleteState(userName); //remove the marble from chaincode state

    // delete the index
    let indexName = 'user~Name';
    let indexKey = stub.createCompositeKey(indexName, [userName]);
    if (!indexKey) {
      throw new Error(' Failed to create the createCompositeKey');
    }
    //  Delete index entry to state.
    await stub.deleteState(indexKey);
  }

  // ===== Example: Parameterized rich query =================================================
  // queryMarblesByOwner queries for marbles based on a passed in owner.
  // This is an example of a parameterized query where the query logic is baked into the chaincode,
  // and accepting a single query parameter (owner).
  // Only available on state databases that support rich query (e.g. CouchDB)
  // =========================================================================================
  async queryByResult(stub, args, thisClass) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting owner name.')
    }

    let result = args[0];
    let queryString = {};
    queryString.selector = {
      test_result: {
        userResult: {
          $elemMatch: {
            $eq: 'null'
          }
        }
      }
    };
    // queryString.selector.testType = 'blood test';
    queryString.selector.test_result.userResult.$elemMatch.$eq = result;
    let method = thisClass['getQueryResultForQueryString'];
    let queryResults = await method(stub, JSON.stringify(queryString), thisClass);
    return queryResults; //shim.success(queryResults);
  }

  // =========================================================================================
  // getQueryResultForQueryString executes the passed in query string.
  // Result set is built and returned as a byte array containing the JSON results.
  // =========================================================================================
  async getQueryResultForQueryString(stub, queryString, thisClass) {

    console.info('- getQueryResultForQueryString queryString:\n' + queryString)
    let resultsIterator = await stub.getQueryResult(queryString);
    let method = thisClass['getAllResults'];

    let results = await method(resultsIterator, false);

    return Buffer.from(JSON.stringify(results));
  }

  async getAllResults(iterator, isHistory) {
    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.IsDelete = res.value.is_delete.toString();
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString('utf8');
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString('utf8');
          }
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return allResults;
      }
    }
  }

  async putLogs(stub, args) {
    let cid = new ClientIdentity(stub)
    let userName = args[0];
    let timestamp = args[1]
    let status = args[2]
    let w = cid.getID()
    let who = w.split("CN=")[1].split("::")[0]
    let resultAsbytes = await stub.getState(userName + '#log') //get the Result from chaincode state

    let logs = {
      userName: 'null',
      log: []
    }
    let log = {
      who: 'null',
      date: 'null',
      status: Boolean
    }

    log.who = who
    log.date = timestamp
    log.status = status

    try {
      logs = JSON.parse(resultAsbytes.toString())
      logs.log.push(log)
    } catch (err) {
      logs.userName = userName
      logs.log.push(log)
    }

    try {
      await stub.putState(userName + '#log', Buffer.from(JSON.stringify(logs)))
    }
    catch (err) {
      throw new Error(`Error adding log files`)
    }
  }

  async putLogs2(stub, args) {
    let cid = new ClientIdentity(stub)
    let userName = args[0];
    let timestamp = args[1]
    let status = args[2]
    let w = cid.getID()
    let who = w.split("CN=")[1].split("::")[0]
    let resultAsbytes = await stub.getState(userName + '#log') //get the Result from chaincode state

    let logs = {
      userName: 'null',
      log: []
    }

    let log = {
      who: 'null',
      date: 'null',
      status: Boolean
    }

    log.who = who
    log.date = timestamp
    log.status = status

    try {
      logs = JSON.parse(resultAsbytes.toString())
      logs.log.push(log)
    } catch (err) {
      logs.userName = userName
      logs.log.push(log)
    }

    try {
      await stub.putState(userName + '#log', Buffer.from(JSON.stringify(logs)))
    }
    catch (err) {
      throw new Error(`Error adding log files`)
    }
  }

  async getLogs(stub, args, thisClass) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting owner name.')
    }

    let userName = args[0];
    let queryString = {};
    queryString.selector = {
      userName: 'null'
    };
    queryString.selector.userName = userName;
    let method = thisClass['getQueryResultForQueryString'];
    let queryResults = await method(stub, JSON.stringify(queryString), thisClass);
    return queryResults; //shim.success(queryResults);
  }

  async getID(stub) {
    let cid = new ClientIdentity(stub);
    let id = cid.getID()
    let attr = cid.getAttributeValue('hf.Affiliation')
    let mspid = cid.getMSPID().toString()
    let id2 = JSON.stringify(id)
    return id2
  }
};

shim.start(new Chaincode());