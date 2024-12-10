const argon2 = require('argon2');

const hash = '$argon2id$v=19$m=65536,t=3,p=4$CdZ7Rre8aKb/3Q43ZwIcnA$UnOldE2G4VFGVGtoGfbvE2O9hEyXsV0DfMAaztNuJvY';
const password = 'ferran1234';

argon2.verify(hash, password)
  .then(isMatch => {
    console.log('¿Las contraseñas coinciden?:', isMatch);
  })
  .catch(err => {
    console.error('Error en argon2.verify:', err);
  });
