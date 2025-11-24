import { useState } from "react";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import {
  Loader,
  MedicalLoader,
  SkeletonLoader,
} from "@/components/misc/Loader";

/**
 * Demo page to showcase all Loader component variants
 * This is for development/testing purposes only
 */
export function LoaderDemo() {
  const [showLoader, setShowLoader] = useState(false);
  const [showMedicalLoader, setShowMedicalLoader] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);

  return (
    <div className="container mx-auto p-8">
      <Typography variant="h2" className="mb-8">
        Loader Component Demo
      </Typography>

      {/* Standard Loader Variants */}
      <Card className="mb-8">
        <CardBody>
          <Typography variant="h5" className="mb-4">
            Standard Loader
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Typography variant="h6" className="mb-2">
                Small
              </Typography>
              <Loader size="sm" message="Loading..." />
            </div>

            <div>
              <Typography variant="h6" className="mb-2">
                Medium (Default)
              </Typography>
              <Loader size="md" message="Loading data..." />
            </div>

            <div>
              <Typography variant="h6" className="mb-2">
                Large
              </Typography>
              <Loader size="lg" message="Processing request..." />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Medical Loader Variants */}
      <Card className="mb-8">
        <CardBody>
          <Typography variant="h5" className="mb-4">
            Medical Loader
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Typography variant="h6" className="mb-2">
                Small
              </Typography>
              <MedicalLoader size="sm" message="Loading..." />
            </div>

            <div>
              <Typography variant="h6" className="mb-2">
                Medium
              </Typography>
              <MedicalLoader size="md" message="Loading medical records..." />
            </div>

            <div>
              <Typography variant="h6" className="mb-2">
                Large
              </Typography>
              <MedicalLoader size="lg" message="Fetching patient data..." />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Skeleton Loader */}
      <Card className="mb-8">
        <CardBody>
          <Typography variant="h5" className="mb-4">
            Skeleton Loader
          </Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Typography variant="h6" className="mb-2">
                3 Lines (Default)
              </Typography>
              <SkeletonLoader />
            </div>

            <div>
              <Typography variant="h6" className="mb-2">
                5 Lines
              </Typography>
              <SkeletonLoader lines={5} />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Interactive Demos */}
      <Card className="mb-8">
        <CardBody>
          <Typography variant="h5" className="mb-4">
            Interactive Demos
          </Typography>

          <div className="space-y-4">
            {/* Toggle Standard Loader */}
            <div>
              <Button
                onClick={() => setShowLoader(!showLoader)}
                className="mb-4"
              >
                {showLoader ? "Hide" : "Show"} Standard Loader
              </Button>
              {showLoader && (
                <div className="border border-blue-gray-100 rounded-lg p-4">
                  <Loader message="This is a toggleable loader..." />
                </div>
              )}
            </div>

            {/* Toggle Medical Loader */}
            <div>
              <Button
                onClick={() => setShowMedicalLoader(!showMedicalLoader)}
                className="mb-4"
              >
                {showMedicalLoader ? "Hide" : "Show"} Medical Loader
              </Button>
              {showMedicalLoader && (
                <div className="border border-blue-gray-100 rounded-lg p-4">
                  <MedicalLoader message="Loading medical data..." />
                </div>
              )}
            </div>

            {/* Full Screen Loader */}
            <div>
              <Button color="red" onClick={() => setShowFullScreen(true)}>
                Show Full Screen Loader (3 seconds)
              </Button>
              {showFullScreen && (
                <>
                  <Loader
                    fullScreen
                    message="Full screen loading with backdrop blur..."
                  />
                  {setTimeout(() => setShowFullScreen(false), 3000)}
                </>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardBody>
          <Typography variant="h5" className="mb-4">
            Usage Examples
          </Typography>

          <div className="bg-gray-50 p-4 rounded-lg">
            <Typography variant="small" className="font-mono">
              {`// Basic usage\n<Loader />\n\n// With custom message\n<Loader message="Loading patient data..." />\n\n// Different sizes\n<Loader size="sm" />\n<Loader size="md" />  // default\n<Loader size="lg" />\n\n// Full screen\n<Loader fullScreen message="Processing..." />\n\n// Medical themed\n<MedicalLoader message="Loading records..." />\n\n// Skeleton loader\n<SkeletonLoader lines={5} />`}
            </Typography>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default LoaderDemo;
