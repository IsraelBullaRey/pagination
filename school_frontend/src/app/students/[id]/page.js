"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_BASE_URL = "http://localhost:8000";

export default function StudentDetail() {
    const { id } = useParams();  // ← AQUÍ id llega bien como string normal
    const router = useRouter();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);   // ← loading comienza en true
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return; // evitar llamada antes de que id exista

        const loadStudent = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/students/${id}/`);

                if (!res.ok) throw new Error("Estudiante no encontrado");

                const data = await res.json();
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
                    Volver al listado
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
                    Volver al listado
                </Button>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl">{student.full_name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Información Personal</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Nombre completo</label>
                                <p className="text-lg">{student.full_name}</p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Código</label>
                                <p className="text-lg font-mono">{student.code}</p>
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-600">Email</label>
                                <p className="text-lg">
                                    <a href={`mailto:${student.email}`} className="text-blue-600 hover:underline">
                                        {student.email}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Grupo</h3>

                        {student.group ? (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-lg font-medium">{student.group.name}</p>
                                <p className="text-sm text-gray-600">Sala {student.group.room_number}</p>
                            </div>
                        ) : (
                            <p className="text-gray-500">Sin grupo asignado</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
