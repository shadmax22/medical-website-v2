import { PatientPrescription } from "@/pages/dashboard";
import { Button, Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { getDoctorPatientsPanel } from "@/services/patient.service";
import { NothingToShow } from "@/components/misc/NothingToShow";

interface MinimalPatient {
  id: string;
  name: string;
  issue?: string;
}

export function PatientsProfiles() {
  const [patients, setPatients] = useState<MinimalPatient[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await getDoctorPatientsPanel();
        setPatients(response.patients || []);
        setIndex(0);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Unable to fetch patients");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const goNext = () => {
    if (index < patients.length - 1) setIndex(index + 1);
  };

  const goPrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (loading) {
    return <div className="mt-12">Loading patients...</div>;
  }

  if (error) {
    return (
      <div className="mt-12">
        <NothingToShow />
        <Typography className="text-center text-red-500 mt-3">
          {error}
        </Typography>
      </div>
    );
  }

  if (!patients.length) {
    return (
      <div className="mt-12">
        <NothingToShow />
        <Typography className="text-center text-blue-gray-600 mt-3">
          No patients are assigned to you yet.
        </Typography>
      </div>
    );
  }

  const currentPatient = patients[index];

  return (
    <>
      <div className="py-3 relative">
        {currentPatient && (
          <PatientPrescription patientId={currentPatient.id} />
        )}

        <div className="sticky right-0 bottom-0 p-3 flex items-center justify-end gap-4 w-full bg-white border-t border-gray-200 rounded-lg">
          <div className="mr-auto text-left">
            <Typography variant="small" className="text-blue-gray-600">
              Viewing
            </Typography>
            <Typography variant="h6" color="blue-gray">
              {currentPatient.name}
            </Typography>
          </div>

          <Button color="blue" disabled={index === 0} onClick={goPrev}>
            Previous Patient
          </Button>

          <Button
            color="green"
            disabled={index === patients.length - 1}
            onClick={goNext}
          >
            Next Patient
          </Button>
        </div>
      </div>
    </>
  );
}
