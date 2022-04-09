const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")
// 启用BDD
const should = chai.should()
global.Should = should
// 让chai支持promise
chai.use(chaiAsPromised)