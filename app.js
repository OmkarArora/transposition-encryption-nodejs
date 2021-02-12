const fs = require("fs");
const readline = require("readline");

let plaintext = "";

// Read input file
try {
  const data = fs.readFileSync("./input.txt", "utf8");
  if (data.length === 0) {
    console.log("Input file empty");
    return;
  }
  // \s matches whitespaces and /g means global
  // replace all whitespaces from the string
  plaintext = data.replace(/\s/g, "");
  plaintext = plaintext.toLowerCase();
  console.log("Input Text: ", plaintext);
} catch (err) {
  console.error(err);
  return;
}

// cmd line input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter Key value: ", (answer) => {
  let strKey1 = answer;

  rl.question("Enter Key for Round 2: ", (answer2) => {
    let strKey2 = answer2;
    let key1 = getKey(strKey1);
    let key2 = getKey(strKey2);
    console.log("Round 1 Key: ", key1);
    console.log("Round 2 Key: ", key2);
    let plainMatrix1 = genMatrix(plaintext, key1);
    console.log("Round 1 Plain Matrix :");
    console.table(plainMatrix1);

    let encryptedText1 = encrypt(plainMatrix1, key1);
    console.log("Round 1 Encrypted Text : ", encryptedText1);

    let plainMatrix2 = genMatrix(encryptedText1, key2);
    console.log("Round 2 Plain Matrix :");
    console.table(plainMatrix2);
    let encryptedText2 = encrypt(plainMatrix2, key2);
    console.log("Round 2 Encrypted Text : ", encryptedText2);

    // Reverse order
    console.log("\n\nDecryption :");
    let decryptedText1 = decrypt(encryptedText2, key2);
    console.log("Round 1 Decrypted Text : ", decryptedText1);

    let decryptedText2 = decrypt(decryptedText1, key1);
    console.log("Round 2 Decrypted Text : ", decryptedText2);
    rl.close();
  });
});

function getKey(_stringKey) {
  let key = [];
  //init array
  for (let i = 0; i < _stringKey.length; i++) {
    key[i] = undefined;
  }
  let keyCount = 1;
  let alphabets = "abcdefghijklmnopqrstuvwxyz";
  for (let ch of alphabets) {
    for (let i = 0; i < _stringKey.length; i++) {
      if (_stringKey[i] === ch) {
        key[i] = keyCount;
        keyCount++;
        break;
      }
    }
  }
  return key;
}

function genMatrix(_plaintext, key) {
  let text = _plaintext;
  let temp = [];
  let matrix = [];
  for (let i = 0; i < text.length; i++) {
    if (temp.length === key.length) {
      matrix.push(temp);
      temp = [];
      // to track the current character
      i = i - 1;
    } else {
      temp.push(text[i]);
      if (i === text.length - 1) {
        let paddingLength = key.length - temp.length;
        for (let j = 0; j < paddingLength; j++) {
          temp.push("$");
        }
        matrix.push(temp);
        break;
      }
    }
  }
  return matrix;
}

function encrypt(plainMatrix, key) {
  let encryptedMatrix = [];
  for (let i = 0; i < plainMatrix.length; i++) {
    let temp = [];
    for (let i = 0; i < key.length; i++) {
      temp.push(0);
    }
    encryptedMatrix.push(temp);
  }

  let numOfRows = plainMatrix.length;
  let numOfColumns = key.length;

  for (let i = 0; i < numOfRows; i++) {
    let temp = [];
    for (let j = 0; j < numOfColumns; j++) {
      let newIndex = key[j] - 1;
      encryptedMatrix[i][newIndex] = plainMatrix[i][j];
    }
  }

  let encryptedText = "";
  for (let i = 0; i < numOfColumns; i++) {
    for (let j = 0; j < numOfRows; j++) {
      encryptedText += encryptedMatrix[j][i];
    }
  }

  console.log("Encrypted Matrix :");
  console.table(encryptedMatrix);

  return encryptedText;
}

function decrypt(encryptedText, key) {
  let numOfRows = encryptedText.length / key.length;
  let numOfColumns = key.length;

  //create encrypted matrix
  let encryptedMatrix = [];
  for (let i = 0; i < numOfRows; i++) {
    let temp = [];
    for (let i = 0; i < numOfColumns; i++) {
      temp.push(0);
    }
    encryptedMatrix.push(temp);
  }

  let _index = 0;
  for (let i = 0; i < numOfColumns; i++) {
    for (let j = 0; j < numOfRows; j++) {
      // encryptedText+=encryptedMatrix[j][i];
      encryptedMatrix[j][i] = encryptedText[_index++];
    }
  }

  // create plain matrix
  let plainMatrix = [];
  for (let i = 0; i < numOfRows; i++) {
    let temp = [];
    for (let i = 0; i < numOfColumns; i++) {
      temp.push(0);
    }
    plainMatrix.push(temp);
  }

  for (let i = 0; i < numOfRows; i++) {
    for (let j = 0; j < numOfColumns; j++) {
      let newIndex = key[j] - 1;
      plainMatrix[i][j] = encryptedMatrix[i][newIndex];
    }
  }
  console.log("Decrypted Matrix :");
  console.table(plainMatrix);
  let decryptedText = "";
  for (let i = 0; i < numOfRows; i++) {
    for (let j = 0; j < numOfColumns; j++) {
      decryptedText += plainMatrix[i][j];
    }
  }
  return decryptedText;
}
