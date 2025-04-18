const { assert,config } = require('chai')
const { describe, it } = require('node:test');
const compress = require('./water-to-ice')

config.truncateThreshold=0

describe("Basic Tests", function(){
  it("It should works for basic tests", function(){
    let water=
        `
H       H+H
+O       O   H+H
H             O
 H   H+H
O+    O
 H
                `,
      ice=
        `HHOH
OHOH
HHOH
H
O
H`
    assert.strictEqual(compress(water) , ice)
  })
  it("It should works for basic tests", function(){

//A complex example test case:
    let water=
`
H       H+HH
+O      OO +OH+H
H      H+H H  O
 H   H+H H
O+    O O+
 H       H
                `,
      ice=
        `HHOHHHOH
OHOHO
HHOHH
HH
OO
HH`

    assert.strictEqual(compress(water) , ice)

  })


  it("It should works for basic tests", function(){

//A complex example test case:
    let water=
`   H       H    
  O+   H  O+    
   H  O+   H O  
       H    H+H 
         H      
   HH   O+      
  O++O   H  H+H 
   HH        O  
                
H              H
+O    O  O    O+
H    H+HH+H    H`,
      ice=
`HHHH
OOOO
HHHH
HHHOH
OOHHOH
HHOHOH
H H
OHOH
H`

    assert.strictEqual(compress(water) , ice)

  })
})
