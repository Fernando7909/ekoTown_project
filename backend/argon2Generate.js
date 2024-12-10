const argon2 = require('argon2');

const password = 'ferran1234';

argon2.hash(password)
  .then(hash => {
    console.log('Hash generado:', hash);

    // Intentar verificar inmediatamente
    return argon2.verify(hash, password);
  })
  .then(isMatch => {
    console.log('¿Las contraseñas coinciden?:', isMatch);
  })
  .catch(err => {
    console.error('Error al generar/verificar el hash:', err);
  });
