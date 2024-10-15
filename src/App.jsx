import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import Swal from "sweetalert2";


export default function App() {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("baja");
  const [tasks, setTasks] = useState([]);
  const tasksCollectionRef = collection(db, "tasks");
  const [error, setError] = useState(null);
  const [success, setSucess] = useState(null);

  // Recuperar Tareas de base Firestore al iniciar 
  useEffect(() => {
    refreshTasks();
  }, []);

  // Mostrar algún error 
  useEffect(() => {
    if (error) {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'error',
        iconColor: 'white',
        title: error,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#803cae',
        color: 'white'
      });
    }
    setError(null)
  }, [error]);


  // Mostrar algún mensaje de exito
  useEffect(() =>{
    if (success) {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'success',
        iconColor: 'white',
        title: success,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        background: '#803cae',
        color: 'white'
      });
    }
    setSucess(null)
  }, [success]);
  

  // Función para recuperar tareas
  const refreshTasks = async () => {
    try {
      const data = await getDocs(tasksCollectionRef);
      setTasks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setError(null);

    } catch (error) {
      setError("Error al recuperar las tareas. Intenta nuevamente.");
    }
  };

  // Agregar Tarea 
  const addTask = async () => {
    if (task.trim() === "" || date.trim() == "" || priority.trim() == "" || description.trim() == "") {
      setError("Completa toda la información para ingresar la tarea.");
      return;
    }

    try {
      await addDoc(tasksCollectionRef,
        {
          text: task,
          description,
          date,
          priority,
          completada: false
        });
      setTask("");
      setDescription("");
      setDate("");
      setPriority("baja");
      setError(null);
      refreshTasks();
      setSucess(`Se agregó una nueva tarea`)

    } catch (error) {
      setError("Error al agregar la tarea. Intenta nuevamente.");
    }
  };

  // Marcar como completada
  const toggleComplete = async (id, currentStatus) => {
    const taskDoc = doc(db, "tasks", id);
    try {
      await updateDoc(taskDoc, { completada: !currentStatus });
      setError(null);
      refreshTasks();

    } catch (error) {
      setError("Error al marcar la tarea como completada. Intenta nuevamente.");
    }
  };

  // Borrar tarea
  const deleteTask = async (id) => {
    try {
      Swal.fire({
        title: '¿Estás seguro de borrar la tarea?',
        icon: 'warning',
        position: 'center',
        showCancelButton: true,
        confirmButtonText: 'Sí, borrar',
        confirmButtonColor: "#e73d18",
        cancelButtonText: 'Cancelar',
        cancelButtonColor: '#01a383',
        background: '#292929',
        color: 'white',
        iconColor: 'white',
        showCloseButton: false,
      }).then(async (result) => {

        if (result.isConfirmed) {
          const taskDoc = doc(db, "tasks", id);
          await deleteDoc(taskDoc);
          setError(null);
          refreshTasks();
          setSucess(`Se eliminó la tarea`)
        }

      });

    } catch (error) {
      setError("Error al eliminar la tarea. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-primary p-6">
      <section className="max-w-md mx-auto bg-fifth shadow-md rounded-md p-4">
        <h1 className="text-2xl font-bold mb-4 text-white underline text-center">To Do List</h1>
        <div className="mb-4 grid p-2 ml-2 gap-2 text-white">
          <input
            type="text"
            className="border rounded-md w-full p-2 outline-none bg-transparent focus:border-third focus:rounded-xl transition-all"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Nombre de tarea..."
          />
          <input
            type="text"
            className="border rounded-md w-full p-2 outline-none bg-transparent focus:border-third focus:rounded-xl transition-all"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción..."
          />
          <input
            type="date"
            className="border rounded-md w-full p-2 outline-none bg-transparent focus:border-third focus:rounded-xl transition-all"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <select
            className="border rounded-md w-full p-2 outline-none bg-transparent focus-within:bg-secundary focus:border-third focus:rounded-xl transition-all"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
          <button
            className="bg-secundary hover:border-white hover:bg-transparent text-white border-2 border-secundary font-bold px-4 py-2 rounded-md transition-all"
            onClick={addTask}
          >
            Agregar
          </button>
        </div>
      </section>

      <ul className="max-w-md mx-auto mt-3">
        {tasks.map((task) => (
          <li key={task.id} className={`bg-white grid gap-3 text-center rounded-lg p-2 mb-3 transition-all  ${task.completada ? "line-through text-gray-500" : ""}`}>
            <div>
              <span className="text-xl font-bold text-fifth">{task.text}</span>
              <p className="text-md text-fifth">{task.description}</p>
              <p className="mt-3 text-md text-fifth">Vence: {task.date}</p>
              <p className="text-md text-fifth">Prioridad: <span className={`uppercase ${task.priority == "alta" ? "text-red-700 font-bold" : "text-secundary font-bold"}`}>{task.priority}</span></p>
            </div>
            <div>
              <button
                className={`text-sm text-white px-2 py-1 rounded-md transition-all ${task.completada ? "bg-third hover:bg-green-900" : "bg-fifth hover:bg-purple-950"}`}
                onClick={() => toggleComplete(task.id, task.completada)}
              >
                {task.completada ? "Completada" : "Terminar"}
              </button>
              <button
                className="bg-fourth text-white text-sm ml-2 px-2 py-1 rounded-md hover:bg-red-800 transition-all"
                onClick={() => deleteTask(task.id)}
              >
                Borrar
              </button>
            </div>
          </li>
        ))}
      </ul>


    </div>
  );
}
