import { redirect } from "next/navigation";

// Los hitos del recorrido viven ahora en "Mi recuperación".
// Mantenemos la ruta para no romper enlaces antiguos.
export default function RecorridoPage() {
  redirect("/recuperacion");
}
