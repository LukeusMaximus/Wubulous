var
    assert = require("assert"),
    unp = require("./usernamepass");

function test_hash(user, pass, hash_value) {
	assert.deepEqual(unp.hashunp(user, pass).toLowerCase(), hash_value);
}

test_hash("red", "apple", "8c557ea1a6579c399626694976664451");
test_hash("yellow", "bannana", "6089d234620ba0df90923e0cee9b393d");
test_hash("green", "pear", "94edfc26b0bfc7470fce9d70b17d18ff");
test_hash("purple", "grape", "bac55506fb4ff163ab47c4f9e2e7c9ba");
test_hash("blue", "blueberry", "6ae54708eb2e82b0eaa194dc767da09f");
console.log("All tests run successfully");
