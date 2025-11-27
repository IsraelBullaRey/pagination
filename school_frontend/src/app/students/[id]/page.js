"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableRow
} from "@/components/ui/table";

const API_BASE_URL = "http://localhost:8000";

export default function StudentDetail() {
  const { id } = useParams();  
  const router = useRouter();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);   
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return; 

    const loadStudent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/students/${id}/`);

        if (!res.ok) throw new Error("Estudiante no encontrado");

        const data = await res.json();
        //console.log("DATA RECIBIDA --->", data);
        setStudent(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <p>Cargando estudiante...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p>{error || "No se encontraron datos del estudiante"}</p>

        <Button onClick={() => router.push("/")} className="mt-4 cursor-pointer">
          ⬅️Volver al listado
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
          <Button
            className="cursor-pointer"
            onClick={() => router.push("/")}
            variant="outline"
          >
            ⬅️Volver al listado
          </Button>
      </div>

      <Card className="max-w-xl mx-auto bg-neutral-50 border border-neutral-200 shadow-sm rounded-xl p-2 text-sm">
        <CardHeader className="pt-4 border-b border-neutral-200">
          <CardTitle className="text-xl font-bold text-center">
            {student.full_name}
          </CardTitle>
        </CardHeader>

        <CardContent className="mb-3">
          <section className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-bold">Información Personal</h3>
            <Separator className="my-3" />
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold text-neutral-700">ID Base</TableCell>
                  <TableCell>{student.id}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-semibold text-neutral-700">Nombre completo</TableCell>
                  <TableCell>{student.full_name}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-semibold text-neutral-700">Código</TableCell>
                  <TableCell>{student.code}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-semibold text-neutral-700">Email</TableCell>
                  <TableCell>
                    <a 
                      href={`mailto:${student.email}`} 
                      className="text-indigo-600 hover:underline break-words"
                    >
                      {student.email}
                    </a>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </section>
          <section className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm mt-6">
            <h3 className="text-lg font-semibold text-neutral-700">Grupo</h3>
            <Separator className="my-3" />

            {student.group ? (
              <div className="p-3 bg-neutral-100 rounded-lg border border-neutral-300">
                <p className="text-sm text-neutral-600 mt-1">Sala {student.group}</p>
              </div>
            ) : (
              <p className="text-neutral-500 text-sm">Sin grupo asignado</p>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
