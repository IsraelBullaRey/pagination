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

// TABLE SHADCN
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const API_BASE_URL = "http://localhost:8000";

export default function Home() {
  const { register, handleSubmit, reset } = useForm();
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [ordering, setOrdering] = useState("full_name");

  const [page, setPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadStudents = async () => {
    const url = `${API_BASE_URL}/students/?search=${query}&ordering=${ordering}&page=${page}`;
    const res = await fetch(url);
    const data = await res.json();

    setStudents(data.results || []);
    setNextPage(data.next);
    setPrevPage(data.previous);
  };

  const orderingClickHandler = (field) => {
    if (ordering === field) setOrdering(`-${field}`);
    else setOrdering(field);
  };

  useEffect(() => {
    loadStudents();
  }, [query, ordering, page]);

  const onSubmit = async (formData) => {
    if (isDuplicate("code", formData.code)) {
      toast.error("El código ya existe");
      return;
    }

    if (isDuplicate("email", formData.email)) {
      toast.error("El email ya existe");
      return;
    }

    if (isDuplicate("full_name", formData.full_name)) {
      toast.error("El nombre completo ya existe");
      return;
    } 
    const response = await fetch(`${API_BASE_URL}/students/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      toast.success("Estudiante creado");
      reset();
      loadStudents();
      setDialogOpen(false);
    } else {
      const errorData = await response.json();
      let msg = "";
      for (const key in errorData) msg += `${key}: ${errorData[key]}\n`;
      toast.error("Error", { description: msg });
    }
  };

  const onError = () => {
    toast.error("Faltan campos obligatorios", {
      description: "Completa todos los campos antes de guardar.",
    });
  };

  const isDuplicate = (field, value) => {
    return students.some((s) => String(s[field]).trim() === String(value).trim());
  };

  return (
    <Card className="bg-gray-200 w-[800px] mx-auto mt-6">
      <CardHeader>
        <CardTitle className="text-bold text-2xl flex justify-center">Listado de Estudiantes</CardTitle>
      </CardHeader>

      <CardContent>

        <div className="bg-neutral-50 rounded-lg flex gap-3 mb-4">
          <Input
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <Button variant="outline" onClick={() => orderingClickHandler("full_name")}>
            {ordering === "full_name" ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </Button>

          <Button variant="outline" onClick={() => orderingClickHandler("code")}>
            {ordering === "code" ? <ArrowDownIcon /> : <ArrowUpIcon />}
          </Button>
        </div>

        <div className="bg-neutral-50 h-80 overflow-y-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-32 text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.map((s) => (
                <TableRow key={s.code}>
                  <TableCell>{s.code}</TableCell>
                  <TableCell className="font-medium">{s.full_name}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell className="text-center">
                    <Link href={`/students/${s.id}`}>
                      <Button variant="secondary" size="sm">
                        Ver detalle
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent className="flex gap-4">

              <PaginationItem>
                <Button
                  variant="outline"
                  disabled={!prevPage}
                  onClick={() => prevPage && setPage(page - 1)}
                >
                  Página anterior
                </Button>
              </PaginationItem>

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

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full" onClick={() => setDialogOpen(true)}>
              Crear estudiante
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Estudiante</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-2 space-y-3"
            >
              <Field>
                <FieldLabel>Nombre completo</FieldLabel>
                <Input {...register("full_name", { required: true })} />
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input {...register("email", { required: true })} />
              </Field>

              <Field>
                <FieldLabel>Código</FieldLabel>
                <Input {...register("code", { required: true })} />
              </Field>

              <Field>
                <FieldLabel>Grupo</FieldLabel>
                <select
                  className="border rounded-md p-2 w-full"
                  {...register("group")}
                >
                  <option value="">Sin grupo</option>
                  <option value="1">Grupo 1</option>
                </select>
              </Field>

              <div className="flex justify-end pt-4">
                <Button type="submit" onClick={handleSubmit(onSubmit, onError)}>
                  Guardar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

      </CardContent>
    </Card>
  );
}
