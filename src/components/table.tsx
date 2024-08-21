"use client";

import { useState, FormEvent, useEffect } from "react";
import { data } from "@/data"; // Importing tasks from DB
import {
  FilePenLine as FilePenLineIcon,
  Trash as TrashIcon,
} from "lucide-react";
import { useLocalStorage } from "usehooks-ts"; // Hook for localStorage

// Table component

export default function Table() {
  const [dataState, setDataState] = useLocalStorage("task", data); // useState to store the tasks, using localStorage
  const [inputState, setInputState] = useState(""); // useState to store the input value
  const [mounted, setMounted] = useState(false); // useState to store the mounted state

  // useEffect used to solve hydration problem
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  // Function to send the task to the list, if the input is empty or the task already exists, it will not be sent
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputState === "") return;
    if (dataState.find((item) => item.task === inputState)) return;
    setInputState("");
    setDataState([
      ...dataState,
      {
        id: dataState.length,
        task: inputState,
        isMarked: false,
      },
    ]);
  };

  // Function to delete a task from the list
  const handleDelete = (index: number) => {
    dataState.splice(index, 1);
    setDataState([...dataState]);
  };

  // Function to mark a task as done
  const handleMarkTask = (id: number) => {
    setDataState((prevState) =>
      prevState.map((item) =>
        item.id === id ? { ...item, isMarked: !item.isMarked } : item
      )
    );
  };

  return (
    <section className="mt-40 flex justify-center">
      <div className=" bg-slate-400 p-5 text-center">
        <h1 className="text-xl font-semibold">
          Gerador Dinâmico de Lista de Tarefas
        </h1>
        <form className="mt-5 flex gap-6" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Insira uma tarefa"
            className="outline-none p-2"
            value={inputState}
            onChange={(e) => setInputState(e.target.value)}
          />
          <button type="submit" className="bg-green-500 rounded-xl py-2 px-3">
            Adicionar
          </button>
        </form>
        <ul className="mt-10 space-y-6">
          {dataState.map((item, index) => {
            return (
              <li
                key={item.id}
                className={` py-2 relative ${
                  item.isMarked ? "line-through bg-green-700" : "bg-red-700"
                }`}
              >
                <span
                  className="absolute left-5 cursor-pointer"
                  aria-label="Editar Tarefa"
                  onClick={() => handleMarkTask(item.id)}
                >
                  <FilePenLineIcon />
                </span>
                {item.task}
                <span
                  className="absolute right-5 cursor-pointer"
                  aria-label="Excluir Tarefa"
                  onClick={() => handleDelete(index)}
                >
                  <TrashIcon />
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
