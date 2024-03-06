import { component$, useStore, useTask$, useVisibleTask$, $, useSignal } from '@builder.io/qwik';
import { User } from '~/models/user';
import { addUser, deleteUserByDni, getUsers, updateUser } from '~/utils/users-provider';

export const UsersList = component$(() => {

    const store = useStore<{ users: User[] }>({
        users: []
    })

    const form = useStore({
        dni: '',
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: '',
        fecha_nacimiento: '',
    })

    const addOrModify = useSignal("Añadir")

    const oldDni = useSignal("")

    useTask$(async () => {
        console.log("Desde useTask") // se ejecuta en la consola del cmd (servidor)

    })

    useVisibleTask$(async () => {
        console.log("Desde useVisibleTask")
        store.users = await getUsers() // se ejecuta en el inspector del navegador (cliente)
    })

    const handleSubmit = $(async (event) => {
        event.preventDefault() // evita el comportamiento por defecto
        if (addOrModify.value === 'Añadir') {
            await addUser(form)
        } else {
            await updateUser(oldDni.value, form)
            addOrModify.value = "Añadir"
        }

    })

    const handleInputChange = $((event: any) => {
        const target = event.target as HTMLInputElement
        form[target.name] = target.value
    })

    const copyForm = $((user: User) => {
        form.dni = user.dni;
        form.nombre = user.nombre;
        form.apellido = user.apellido;
        form.direccion = user.direccion;
        form.telefono = user.telefono;
        form.fecha_nacimiento = user.fecha_nacimiento
    })

    const cleanForm = $(() => {
        form.dni = ""
        form.nombre = ""
        form.apellido = ""
        form.direccion = ""
        form.telefono = ""
        form.fecha_nacimiento = ""
    })

    const deleteUser = $(async (dni: string) => {
        await deleteUserByDni(dni)
        store.users = await getUsers()
    })
    return (
        <div class="flex justify-center">
            <div class="px-6 py-4 bg-alanturing-100">
                <table border="1">
                    <thead>
                        <tr>
                            <th>DNI2</th>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Telefono</th>
                            <th>Dirección</th>
                            <th>Fecha de nacimiento</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {store.users.map((user) => (
                            <tr key={user.dni}>
                                <th>{user.dni}</th>
                                <th>{user.nombre}</th>
                                <th>{user.apellido}</th>
                                <th>{user.telefono}</th>
                                <th>{user.direccion}</th>
                                <th>{user.fecha_nacimiento}</th>

                                <td>
                                    <button onClick$={() => deleteUser(user.dni)}>Borrar</button>
                                </td>
                                <td>
                                    <button onClick$={() => {
                                        addOrModify.value = 'Modificar'
                                        oldDni.value = user.dni
                                        copyForm(user)
                                    }}>
                                        Modificar
                                    </button>

                                </td>
                            </tr>
                        ))}
                        <tr>
                            <form onSubmit$={handleSubmit}>
                                <td>
                                    <input name="dni" type="text" value={form.dni} onInput$={handleInputChange} />
                                </td>
                                <td>
                                    <input name="nombre" type="text" value={form.nombre} onInput$={handleInputChange} />
                                </td>
                                <td>
                                    <input name="apellido" type="text" value={form.apellido} onInput$={handleInputChange} />
                                </td>
                                <td>
                                    <input name="telefono" type="text" value={form.telefono} onInput$={handleInputChange} />
                                </td>
                                <td>
                                    <input name="direccion" type="text" value={form.direccion} onInput$={handleInputChange} />
                                </td>
                                <td>
                                    <input name="fecha_nacimiento" type="date" value={form.fecha_nacimiento} onInput$={handleInputChange} />
                                </td>


                                <td>
                                    <button type="submit">Aceptar</button>
                                </td>
                                <td>
                                    <span
                                        style={`visibility: ${addOrModify.value === 'Añadir' ? 'hidden' : 'visible'}`}
                                        onClick$={() => {
                                            addOrModify.value = "Añadir";
                                            cleanForm(); console.log("Cancelar")
                                        }}>
                                        Cancelar
                                    </span>
                                </td>
                            </form>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    )
});