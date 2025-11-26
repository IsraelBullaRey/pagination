"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";

import { Field, FieldLabel } from "@/components/ui/field";

import Link from "next/link";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

export default function Home() {
  const { register, handleSubmit, reset } = useForm();
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [ordering, setOrdering] = useState("full_name");

  // PAGINATION
  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [total, setTotal] = useState(0);

  const loadStudents = async () => {
    const url = `${API_BASE_URL}/students/?search=${query}&ordering=${ordering}&page=${page}`;
    const res = await fetch(url);
    const data = await res.json();

    setStudents(data.results || []);
    setNextPage(data.next);
    setPrevPage(data.previous);
    setTotal(data.count);
  };

  const orderingClickHandler = (field) => {
    if (ordering === field) setOrdering(`-${field}`);
    else setOrdering(field);
  };

  useEffect(() => {
    loadStudents();
  }, [query, ordering, page]);

  // Crear estudiante
  const onSubmit = async (formData) => {
    const response = await fetch(`${API_BASE_URL}/students/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      toast.success("Estudiante creado");
      reset();
      loadStudents();
      document.getElementById("closeDialogBtn").click();
    } else {
      const errorData = await response.json();
      let msg = "";
      for (const key in errorData) {
        msg += `${key}: ${errorData[key]}\n`;
      }
      toast.error("Error", { description: msg });
    }
  };

  return (
    <Card className="w-[600px] mx-auto mt-6">
      <CardHeader>
        <CardTitle>Listado de Estudiantes</CardTitle>
      </CardHeader>

      <CardContent>
        {/* BUSCADOR */}

        <div className="flex gap-3">
          <Input
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {/* ORDERING NAME */}
          <Button
            variant="outline"
            onClick={() => orderingClickHandler("full_name")}
          >
            {ordering === "full_name" ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </Button>

          {/* ORDERING CODE */}
          <Button
            variant="outline"
            onClick={() => orderingClickHandler("code")}
          >
            {ordering === "code" ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </Button>
        </div>

        {/* LISTADO */}

        <div className="mt-4 h-80 overflow-y-auto">
          <ul>
            {students.map((s) => (
              <li
                key={s.code}
                className="p-2 border rounded mb-2 flex justify-between"
              >
                <div>
                  <b>{s.full_name}</b>  
                  <span className="ml-2 text-gray-500">{s.email}</span>
                </div>

                <Link href={`/students/${s.id}`}>
                  <Button variant="secondary">Ver detalle</Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* PAGINATION */}

        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent className="flex gap-4">
              {/* PREVIOUS */}
              <PaginationItem>
                <Button
                  variant="outline"
                  disabled={!prevPage}
                  onClick={() => prevPage && setPage(page - 1)}
                >
                  Página anterior
                </Button>
              </PaginationItem>

              {/* NEXT */}
              <PaginationItem>
                <Button
                  variant="outline"
                  disabled={!nextPage}
                  onClick={() => nextPage && setPage(page + 1)}
                >
                  Página siguiente
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* DIALOG PARA CREAR */}

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full">Crear estudiante</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Estudiante</DialogTitle>
            </DialogHeader>

            <Field className="mt-2">
              <FieldLabel>Nombre completo</FieldLabel>
              <Input {...register("full_name", { required: true })} />
            </Field>

            <Field className="mt-2">
              <FieldLabel>Email</FieldLabel>
              <Input {...register("email", { required: true })} />
            </Field>

            <Field className="mt-2">
              <FieldLabel>Código</FieldLabel>
              <Input {...register("code", { required: true })} />
            </Field>

            <div className="flex justify-end mt-4">
              <Button onClick={handleSubmit(onSubmit)}>
                Guardar
              </Button>

              {/* botón invisible para cerrar modal programáticamente */}
              <button id="closeDialogBtn" className="hidden"></button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
