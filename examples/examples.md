

# Some rough examples mainly for testing

Please help make these more interesting :-)



[TOC]



## hbar transfers

### [simple hbar transfer (2 party)](https://katomic.org/dev/?kscript=%23examples+%2F+test+cases%0A%23simple+hbar+transfer%0A%0A%23environment%0Awe+are+on+testnet%0A%0A%23transfers%0A0.0.12345+sends+1+hbar%0A0.0.9876+receives+1+hbar%0A)

```katomic
#environment
we are on testnet

#transfers
0.0.12345 sends 1 hbar
0.0.9876 receives 1 hbar
```

```json
"addHbarTransfer": [
    {
      "accountId": "0.0.12345",
      "value": -1,
      "userInput": "0.0.12345 sends 1 hbar"
    },
    {
      "accountId": "0.0.9876",
      "value": "1",
      "userInput": "0.0.9876 receives 1 hbar"
    }
  ],
```



### [simple hbar transfer, with aliases](https://katomic.org/dev/?kscript=%23examples+%2F+test+cases%0A%23simple+hbar+transfer%2C+with+aliases%0A%0A%23environment%0Awe+are+on+testnet%0A%0A%23aliases%0AAlice+is+0.0.12345%0ABob+is+0.0.9876%0A%0A%23transfers%0AAlice+sends+1+hbar%0ABob+receives+1+hbar%0A)

```katomic
#environment
we are on testnet

#aliases
Alice is 0.0.12345
Bob is 0.0.9876

#transfers
Alice sends 1 hbar
Bob receives 1 hbar
```

```json
  "alias": {
    "Alice": "0.0.12345",
    "Bob": "0.0.9876"
  },
  "addHbarTransfer": [
    {
      "accountId": "0.0.12345",
      "value": -1,
      "userInput": "Alice sends 1 hbar"
    },
    {
      "accountId": "0.0.9876",
      "value": "1",
      "userInput": "Bob receives 1 hbar"
    }
  ],
```



### ⚠️balance mismatch

```katomic
#environment
we are on testnet

#transfers
0.0.12345 sends 1.2 hbar
0.0.9876 receives 1.1 hbar
```

```
⚠️ Hbar transfers must sum to zero
```



### [3 party, with decimals](https://katomic.org/dev/?kscript=%23examples+%2F+test+cases%0A%23simple+hbar+transfer%0A%0A%23environment%0Awe+are+on+testnet%0A%0A%23transfers%0A0.0.12345+sends+1.2+hbar%0A0.0.9876+receives+1.1+hbar%0A0.0.65433+receives+0.1+hbar)

```katomic
#transfers
0.0.12345 sends 1.2 hbar
0.0.9876 receives 1.1 hbar
0.0.65433 receives 0.1 hbar
```

```json
 "addHbarTransfer": [
    {
      "accountId": "0.0.12345",
      "value": -1.2,
      "userInput": "0.0.12345 sends 1.2 hbar"
    },
    {
      "accountId": "0.0.9876",
      "value": "1.1",
      "userInput": "0.0.9876 receives 1.1 hbar"
    },
    {
      "accountId": "0.0.65433",
      "value": "0.1",
      "userInput": "0.0.65433 receives 0.1 hbar"
    }
  ],
```



## Fungible token transfer

### [FT transfer, 3 party, with aliases](https://katomic.org/dev/?kscript=%23examples+%2F+test+cases%0A%23simple+hbar+transfer%0A%0A%23environment%0Awe+are+on+testnet%0A%0A%23alias%0Amy_token+is+0.0.77777%0A%0A%23transfers%0A0.0.12345+sends+1.2+my_token%0A0.0.9876+receives+1.1+my_token%0A0.0.65433+receives+0.1+my_token%0A)

```katomic
#environment
we are on testnet

#alias
my_token is 0.0.77777

#transfers
0.0.12345 sends 1.2 my_token
0.0.9876 receives 1.1 my_token
0.0.65433 receives 0.1 my_token
```

```json
  "alias": {
    "my_token": "0.0.77777"
  },
  "addHbarTransfer": [],
  "addTokenTransfer": [
    {
      "tokenId": "0.0.77777",
      "accountId": "0.0.12345",
      "value": -1.2,
      "userInput": "0.0.12345 sends 1.2 my_token"
    },
    {
      "tokenId": "0.0.77777",
      "accountId": "0.0.9876",
      "value": "1.1",
      "userInput": "0.0.9876 receives 1.1 my_token"
    },
    {
      "tokenId": "0.0.77777",
      "accountId": "0.0.65433",
      "value": "0.1",
      "userInput": "0.0.65433 receives 0.1 my_token"
    }
  ],
```



### ⚠️ FT balance mismatch

```katomic
my_token is 0.0.77777
0.0.12345 sends 1.2 my_token
0.0.9876 receives 1.1 my_token
0.0.65433 receives 0.2 my_token
```

```
⚠️ FT transfers must sum to zero for token 0.0.77777
```



### [Mixed token transfer](https://katomic.org/dev/?kscript=%23environment%0Awe+are+on+testnet%0A%0A%23aliases%0AAlice+is+0.0.12345%0ABob+is+0.0.23456%0ACarole+is+0.0.34567%0A%0Amy_token+is+0.0.77777%0Aapples+is+0.0.88888%0A%0A%23transfers%0AAlice+sends+1.2+my_token%0ABob+receives+1.1+my_token%0ACarole+receives+0.1+my_token%0ABob+sends+5+apples%0AAlice+receives+5+apples)

```katomic
#aliases
Alice is 0.0.12345
Bob is 0.0.23456
Carole is 0.0.34567

my_token is 0.0.77777
apples is 0.0.88888

#transfers
Alice sends 1.2 my_token
Bob receives 1.1 my_token
Carole receives 0.1 my_token
Bob sends 5 apples
Alice receives 5 apples
```

```json
 "alias": {
    "Alice": "0.0.12345",
    "Bob": "0.0.23456",
    "Carole": "0.0.34567",
    "my_token": "0.0.77777",
    "apples": "0.0.88888"
  },
  "addHbarTransfer": [],
  "addTokenTransfer": [
    {
      "tokenId": "0.0.77777",
      "accountId": "0.0.12345",
      "value": -1.2,
      "userInput": "Alice sends 1.2 my_token"
    },
    {
      "tokenId": "0.0.77777",
      "accountId": "0.0.23456",
      "value": "1.1",
      "userInput": "Bob receives 1.1 my_token"
    },
    {
      "tokenId": "0.0.77777",
      "accountId": "0.0.34567",
      "value": "0.1",
      "userInput": "Carole receives 0.1 my_token"
    },
    {
      "tokenId": "0.0.88888",
      "accountId": "0.0.23456",
      "value": -5,
      "userInput": "Bob sends 5 apples"
    },
    {
      "tokenId": "0.0.88888",
      "accountId": "0.0.12345",
      "value": "5",
      "userInput": "Alice receives 5 apples"
    }
  ],
```

.. various todo...



## NFT transfers

### [NFT transfer](https://katomic.org/dev/?kscript=%23environment%0Awe+are+on+testnet%0A%0A%23aliases%0AAlice+is+0.0.12345%0ABob+is+0.0.23456%0A%0Amy_collection+is+0.0.77777%0A%0A%23transfers%0AAlice+sends+NFT+my_collection+%231to100+to+Bob%0A%23+means+any+one+in+the+serial+range+1+to+100%0A%0A)

```
#aliases
Alice is 0.0.12345
Bob is 0.0.23456

my_collection is 0.0.77777

#transfers
Alice sends NFT my_collection #1to100 to Bob
#  #1to100 means any one in the serial range 1 to 100
```

 

```json
 "alias": {
    "Alice": "0.0.12345",
    "Bob": "0.0.23456",
    "my_collection": "0.0.77777"
  },
  "addNftTransfer": [
    {
      "sender": "0.0.12345",
      "tokenId": "0.0.77777",
      "serial": "1to100",
      "receiver": "0.0.23456",
      "userInput": "Alice sends NFT my_collection #1to100 to Bob"
    }
  ],
```



# Point-of-sale (POS) display

```
display title Place your product title here
display description Enter a description
display button Buy now
display thumbnail https://yoursite.com/yourimage.jpg
```

```json
  "display": {
    "title": "Place your product title here",
    "description": "Enter a description",
    "button": "Buy now",
    "thumbnail": "https://yoursite.com/yourimage.jpg"
  },
```



# Advanced features

## Parameters

these can be injected at POS

```katomic
#transfers
{buyer} sends {paymentTokenAmount} {paymentToken}
{seller} receives {paymentTokenAmount} {paymentToken}

{seller} sends NFT {collection} #{serial} to {buyer}
```

```json
"addTokenTransfer": [
    {
      "tokenId": "{paymentToken}",
      "accountId": "{buyer}",
      "value": "-{paymentTokenAmount}",
      "userInput": "{buyer} sends {paymentTokenAmount} {paymentToken}"
    },
    {
      "tokenId": "{paymentToken}",
      "accountId": "{seller}",
      "value": "{paymentTokenAmount}",
      "userInput": "{seller} receives {paymentTokenAmount} {paymentToken}"
    }
  ],
  "addNftTransfer": [
    {
      "sender": "{seller}",
      "tokenId": "{collection}",
      "serial": "{serial}",
      "receiver": "{buyer}",
      "userInput": "{seller} sends NFT {collection} #{serial} to {buyer}"
    }
  ],
```

## Conditions

```
conditions 0 scriptName onceOnlyPerAccount
```

