var duenos = [];
        var mascotas = [];
        var idDueno = 1;
        var idMascota = 1;

        function mostrarStatus(mensaje, tipo) {
            var statusDiv = document.getElementById('status');
            statusDiv.innerHTML = '<div class="status ' + tipo + '">' + mensaje + '</div>';
            setTimeout(function() {
                statusDiv.innerHTML = '';
            }, 3000);
        }

        function validarCampo(valor, nombre) {
            if (!valor || valor.trim() === '') {
                throw new Error('El campo ' + nombre + ' es obligatorio');
            }
        }

        function validarNumero(valor, nombre) {
            var numero = parseFloat(valor);
            if (isNaN(numero) || numero <= 0) {
                throw new Error(nombre + ' debe ser un número positivo');
            }
            return numero;
        }

        function buscarDueno(cedula) {
            for (var i = 0; i < duenos.length; i++) {
                if (duenos[i].cedula === cedula) {
                    return duenos[i];
                }
            }
            return null;
        }

        function registrarDueno(callback) {
            try {
                var nombre = prompt('Nombre del dueño:');
                validarCampo(nombre, 'nombre');

                var cedula = prompt('Cédula:');
                validarCampo(cedula, 'cédula');

                if (buscarDueno(cedula)) {
                    callback(new Error('Ya existe un dueño con esa cédula'), null);
                    return;
                }

                var telefono = prompt('Teléfono:');
                validarCampo(telefono, 'teléfono');

                var correo = prompt('Correo electrónico:');
                validarCampo(correo, 'correo');

                mostrarStatus('Validando datos...', 'loading');

                setTimeout(function() {
                    var nuevoDueno = {
                        id: idDueno,
                        nombre: nombre.trim(),
                        cedula: cedula.trim(),
                        telefono: telefono.trim(),
                        correo: correo.trim()
                    };
                    idDueno++;
                    duenos.push(nuevoDueno);
                    callback(null, nuevoDueno);
                }, 1500);

            } catch (error) {
                callback(error, null);
            }
        }

        function registrarMascota(callback) {
            try {
                var nombre = prompt('Nombre de la mascota:');
                validarCampo(nombre, 'nombre');

                var especie = prompt('Especie (Perro, Gato, Ave, Reptil, Otro):');
                var especiesValidas = ['Perro', 'Gato', 'Ave', 'Reptil', 'Otro'];
                var especieEncontrada = false;
                for (var i = 0; i < especiesValidas.length; i++) {
                    if (especiesValidas[i] === especie) {
                        especieEncontrada = true;
                        break;
                    }
                }
                if (!especieEncontrada) {
                    throw new Error('Especie debe ser: Perro, Gato, Ave, Reptil o Otro');
                }

                var edad = validarNumero(prompt('Edad en años:'), 'Edad');
                var peso = validarNumero(prompt('Peso en kg:'), 'Peso');

                var estado = prompt('Estado de salud (Sano, Enfermo, En tratamiento):');
                var estadosValidos = ['Sano', 'Enfermo', 'En tratamiento'];
                var estadoEncontrado = false;
                for (var i = 0; i < estadosValidos.length; i++) {
                    if (estadosValidos[i] === estado) {
                        estadoEncontrado = true;
                        break;
                    }
                }
                if (!estadoEncontrado) {
                    throw new Error('Estado debe ser: Sano, Enfermo o En tratamiento');
                }

                var cedula = prompt('Cédula del dueño:');
                validarCampo(cedula, 'cédula del dueño');

                mostrarStatus('Validando dueño...', 'loading');

                setTimeout(function() {
                    var dueno = buscarDueno(cedula);
                    if (!dueno) {
                        callback(new Error('No se encontró un dueño con esa cédula'), null);
                        return;
                    }

                    var nuevaMascota = {
                        id: idMascota,
                        nombre: nombre.trim(),
                        especie: especie,
                        edad: edad,
                        peso: peso,
                        estadoSalud: estado,
                        duenoId: dueno.id
                    };
                    idMascota++;
                    mascotas.push(nuevaMascota);
                    callback(null, nuevaMascota);
                }, 2000);

            } catch (error) {
                callback(error, null);
            }
        }

        function listarMascotas() {
            if (mascotas.length === 0) {
                alert('No hay mascotas registradas');
                return;
            }

            var lista = 'LISTA DE MASCOTAS:\n\n';
            for (var i = 0; i < mascotas.length; i++) {
                var mascota = mascotas[i];
                var dueno = null;
                for (var j = 0; j < duenos.length; j++) {
                    if (duenos[j].id === mascota.duenoId) {
                        dueno = duenos[j];
                        break;
                    }
                }
                lista += 'ID: ' + mascota.id + '\n';
                lista += 'Nombre: ' + mascota.nombre + '\n';
                lista += 'Especie: ' + mascota.especie + '\n';
                lista += 'Edad: ' + mascota.edad + ' años\n';
                lista += 'Peso: ' + mascota.peso + ' kg\n';
                lista += 'Estado: ' + mascota.estadoSalud + '\n';
                lista += 'Dueño: ' + (dueno ? dueno.nombre : 'No encontrado') + '\n';
                lista += '---\n';
            }
            alert(lista);
            console.log('Mascotas:', mascotas);
        }

        function buscarMascota(nombre) {
            return new Promise(function(resolve, reject) {
                if (!nombre || nombre.trim() === '') {
                    reject(new Error('El nombre no puede estar vacío'));
                    return;
                }

                mostrarStatus('Buscando mascota...', 'loading');

                setTimeout(function() {
                    var encontradas = [];
                    for (var i = 0; i < mascotas.length; i++) {
                        if (mascotas[i].nombre.toLowerCase().indexOf(nombre.toLowerCase()) !== -1) {
                            encontradas.push(mascotas[i]);
                        }
                    }

                    if (encontradas.length > 0) {
                        resolve(encontradas);
                    } else {
                        reject(new Error('No se encontraron mascotas con ese nombre'));
                    }
                }, 1500);
            });
        }

        function actualizarEstado(nombre, nuevoEstado) {
            return new Promise(function(resolve, reject) {
                if (!nombre || nombre.trim() === '') {
                    reject(new Error('El nombre no puede estar vacío'));
                    return;
                }

                var estadosValidos = ['Sano', 'Enfermo', 'En tratamiento'];
                var estadoValido = false;
                for (var i = 0; i < estadosValidos.length; i++) {
                    if (estadosValidos[i] === nuevoEstado) {
                        estadoValido = true;
                        break;
                    }
                }
                if (!estadoValido) {
                    reject(new Error('Estado debe ser: Sano, Enfermo o En tratamiento'));
                    return;
                }

                mostrarStatus('Consultando veterinario...', 'loading');

                setTimeout(function() {
                    var mascota = null;
                    for (var i = 0; i < mascotas.length; i++) {
                        if (mascotas[i].nombre.toLowerCase() === nombre.toLowerCase()) {
                            mascota = mascotas[i];
                            break;
                        }
                    }

                    if (!mascota) {
                        reject(new Error('No se encontró la mascota'));
                        return;
                    }

                    mascota.estadoSalud = nuevoEstado;
                    resolve(mascota);
                }, 1000);
            });
        }

        function eliminarMascota(nombre) {
            return new Promise(function(resolve, reject) {
                if (!nombre || nombre.trim() === '') {
                    reject(new Error('El nombre no puede estar vacío'));
                    return;
                }

                mostrarStatus('Procesando eliminación...', 'loading');

                setTimeout(function() {
                    var indice = -1;
                    for (var i = 0; i < mascotas.length; i++) {
                        if (mascotas[i].nombre.toLowerCase() === nombre.toLowerCase()) {
                            indice = i;
                            break;
                        }
                    }

                    if (indice === -1) {
                        reject(new Error('No se encontró la mascota'));
                        return;
                    }

                    var confirmar = confirm('¿Está seguro de eliminar a ' + mascotas[indice].nombre + '?');
                    if (confirmar) {
                        var eliminada = mascotas.splice(indice, 1)[0];
                        resolve(eliminada);
                    } else {
                        reject(new Error('Eliminación cancelada'));
                    }
                }, 2000);
            });
        }

        function verMascotasDueno(cedula) {
            return new Promise(function(resolve, reject) {
                if (!cedula || cedula.trim() === '') {
                    reject(new Error('La cédula no puede estar vacía'));
                    return;
                }

                mostrarStatus('Cargando información...', 'loading');

                setTimeout(function() {
                    var dueno = buscarDueno(cedula);
                    if (!dueno) {
                        reject(new Error('No se encontró un dueño con esa cédula'));
                        return;
                    }

                    var mascotasDueno = [];
                    for (var i = 0; i < mascotas.length; i++) {
                        if (mascotas[i].duenoId === dueno.id) {
                            mascotasDueno.push(mascotas[i]);
                        }
                    }

                    resolve({ dueno: dueno, mascotas: mascotasDueno });
                }, 2000);
            });
        }

        function mostrarMenu() {
            return 'SISTEMA VETERINARIA\n\n' +
                   '1. Registrar dueño\n' +
                   '2. Registrar mascota\n' +
                   '3. Listar mascotas\n' +
                   '4. Buscar mascota\n' +
                   '5. Actualizar estado\n' +
                   '6. Eliminar mascota\n' +
                   '7. Ver mascotas de dueño\n' +
                   '8. Salir\n\n' +
                   'Seleccione opción:';
        }

        function ejecutarOpcion(opcion, callback) {
            switch (opcion) {
                case '1':
                    registrarDueno(function(error, dueno) {
                        if (error) {
                            alert('Error: ' + error.message);
                            mostrarStatus('Error: ' + error.message, 'error');
                        } else {
                            alert('Dueño registrado correctamente');
                            mostrarStatus('Dueño registrado', 'success');
                            console.log('Nuevo dueño:', dueno);
                        }
                        callback();
                    });
                    break;

                case '2':
                    registrarMascota(function(error, mascota) {
                        if (error) {
                            alert('Error: ' + error.message);
                            mostrarStatus('Error: ' + error.message, 'error');
                        } else {
                            alert('Mascota registrada correctamente');
                            mostrarStatus('Mascota registrada', 'success');
                            console.log('Nueva mascota:', mascota);
                        }
                        callback();
                    });
                    break;

                case '3':
                    listarMascotas();
                    callback();
                    break;

                case '4':
                    var nombre = prompt('Nombre de la mascota a buscar:');
                    if (nombre) {
                        buscarMascota(nombre)
                            .then(function(encontradas) {
                                var resultado = 'MASCOTAS ENCONTRADAS:\n\n';
                                for (var i = 0; i < encontradas.length; i++) {
                                    var mascota = encontradas[i];
                                    var dueno = null;
                                    for (var j = 0; j < duenos.length; j++) {
                                        if (duenos[j].id === mascota.duenoId) {
                                            dueno = duenos[j];
                                            break;
                                        }
                                    }
                                    resultado += 'Nombre: ' + mascota.nombre + '\n';
                                    resultado += 'Especie: ' + mascota.especie + '\n';
                                    resultado += 'Edad: ' + mascota.edad + ' años\n';
                                    resultado += 'Estado: ' + mascota.estadoSalud + '\n';
                                    resultado += 'Dueño: ' + (dueno ? dueno.nombre : 'No encontrado') + '\n';
                                    resultado += '---\n';
                                }
                                alert(resultado);
                                mostrarStatus('Búsqueda completada', 'success');
                                console.log('Mascotas encontradas:', encontradas);
                                callback();
                            })
                            .catch(function(error) {
                                alert('Error: ' + error.message);
                                mostrarStatus('Error: ' + error.message, 'error');
                                callback();
                            });
                    } else {
                        callback();
                    }
                    break;

                case '5':
                    var nombre = prompt('Nombre de la mascota:');
                    var estado = prompt('Nuevo estado (Sano, Enfermo, En tratamiento):');
                    if (nombre && estado) {
                        actualizarEstado(nombre, estado)
                            .then(function(mascota) {
                                alert('Estado actualizado: ' + mascota.nombre + ' - ' + mascota.estadoSalud);
                                mostrarStatus('Estado actualizado', 'success');
                                console.log('Mascota actualizada:', mascota);
                                callback();
                            })
                            .catch(function(error) {
                                alert('Error: ' + error.message);
                                mostrarStatus('Error: ' + error.message, 'error');
                                callback();
                            });
                    } else {
                        callback();
                    }
                    break;

                case '6':
                    var nombre = prompt('Nombre de la mascota a eliminar:');
                    if (nombre) {
                        eliminarMascota(nombre)
                            .then(function(mascota) {
                                alert('Mascota eliminada: ' + mascota.nombre);
                                mostrarStatus('Mascota eliminada', 'success');
                                console.log('Mascota eliminada:', mascota);
                                callback();
                            })
                            .catch(function(error) {
                                alert('Error: ' + error.message);
                                mostrarStatus('Error: ' + error.message, 'error');
                                callback();
                            });
                    } else {
                        callback();
                    }
                    break;

                case '7':
                    var cedula = prompt('Cédula del dueño:');
                    if (cedula) {
                        verMascotasDueno(cedula)
                            .then(function(resultado) {
                                var mensaje = 'MASCOTAS DE ' + resultado.dueno.nombre.toUpperCase() + ':\n\n';
                                if (resultado.mascotas.length === 0) {
                                    mensaje += 'Este dueño no tiene mascotas registradas.';
                                } else {
                                    for (var i = 0; i < resultado.mascotas.length; i++) {
                                        var mascota = resultado.mascotas[i];
                                        mensaje += '• ' + mascota.nombre + ' (' + mascota.especie + ')\n';
                                        mensaje += '  Edad: ' + mascota.edad + ' años, Peso: ' + mascota.peso + ' kg\n';
                                        mensaje += '  Estado: ' + mascota.estadoSalud + '\n\n';
                                    }
                                }
                                alert(mensaje);
                                mostrarStatus('Consulta completada', 'success');
                                console.log('Resultado:', resultado);
                                callback();
                            })
                            .catch(function(error) {
                                alert('Error: ' + error.message);
                                mostrarStatus('Error: ' + error.message, 'error');
                                callback();
                            });
                    } else {
                        callback();
                    }
                    break;

                case '8':
                    alert('Hasta luego!');
                    mostrarStatus('Sistema cerrado', 'success');
                    callback(true);
                    break;

                default:
                    alert('Opción no válida');
                    mostrarStatus('Opción no válida', 'error');
                    callback();
            }
        }

        function bucleMenu() {
            var opcion = prompt(mostrarMenu());
            if (opcion === null) {
                alert('Hasta luego!');
                return;
            }

            ejecutarOpcion(opcion, function(salir) {
                if (!salir) {
                    setTimeout(bucleMenu, 100);
                }
            });
        }

        function iniciarApp() {
            mostrarStatus('Sistema iniciado', 'success');
            
            duenos.push({
                id: idDueno++,
                nombre: 'Juan Pérez',
                cedula: '12345678',
                telefono: '555-0123',
                correo: 'juan@email.com'
            });

            mascotas.push({
                id: idMascota++,
                nombre: 'Max',
                especie: 'Perro',
                edad: 3,
                peso: 25.5,
                estadoSalud: 'Sano',
                duenoId: 1
            });

            console.log('Sistema iniciado');
            console.log('Dueños de prueba:', duenos);
            console.log('Mascotas de prueba:', mascotas);

            bucleMenu();
        }

        console.log('Aplicación cargada. Haz clic en Iniciar Aplicación.');