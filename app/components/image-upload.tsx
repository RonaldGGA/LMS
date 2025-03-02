import { Plus, UploadCloud } from "lucide-react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";

// ImageUpload component
export const ImageUpload = ({
  onSuccess,
  isValue,
  type = "book",
}: {
  onSuccess: (url: string) => void;
  isValue: boolean;
  type?: string;
}) => {
  return (
    <CldUploadWidget
      options={{
        multiple: false,
        sources: ["local"], // Solo permite subir desde el ordenador
        resourceType: "image",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "jfif", "avif"],
        maxFileSize: 5000000, // 5MB
        showAdvancedOptions: false,
        showUploadMoreButton: false,
        styles: {
          palette: {
            window: "#ffffff",
            windowBorder: "#e0e0e0",
            tabIcon: "#2563eb", // Color principal
            menuIcons: "#2563eb", // Color de íconos
            textDark: "#1f2937", // Texto oscuro
            textLight: "#ffffff", // Texto claro
            link: "#2563eb", // Enlaces
            action: "#2563eb", // Botones de acción
            inactiveTabIcon: "#9ca3af", // Pestañas inactivas
            error: "#dc2626", // Errores
            inProgress: "#2563eb", // Progreso
            complete: "#16a34a", // Completado
          },
          frame: {
            background: "transparent",
          },
          fonts: {
            default: null, // Usa la fuente de tu sitio
          },
        },
        text: {
          en: {
            "queue.title": "Subir portada del libro",
            "queue.instruction": "Arrastra imágenes o %browse%",
            "queue.status.uploading": "Subiendo...",
            "queue.status.processing": "Procesando...",
            "upload.error.max_size_exceeded": "El archivo excede 5MB",
            "upload.error.file_type_not_allowed": "Formato no permitido",
          },
        },
      }}
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME}
      onSuccess={(result) => {
        const info = result.info as CloudinaryUploadWidgetInfo;
        onSuccess(info.secure_url);
      }}
    >
      {({ open, isLoading }) => {
        if (isValue) {
          return <></>;
        }

        if (type === "user") {
          return (
            <div
              aria-disabled={isLoading}
              onClick={() => (!isLoading ? open() : undefined)}
              className={`
    absolute h-32 w-32 rounded-full 
    border-2 border-dashed border-gray-300
    flex flex-col items-center justify-center 
    cursor-pointer hover:border-blue-500 hover:scale-[1.02]
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    transition-all duration-300 ease-in-out
    group shadow-sm hover:shadow-md
    ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
  `}
              role="button"
              tabIndex={0}
              aria-label="Upload profile photo"
            >
              <div className="relative flex flex-col items-center">
                {/* Icon Container with animated background */}
                <div
                  className="
      p-3 rounded-full
      bg-gray-100 group-hover:bg-blue-50
      transition-colors duration-300
      flex items-center justify-center
    "
                >
                  <Plus
                    className={`
          text-gray-500 group-hover:text-blue-600
          transition-all duration-300
          ${!isLoading && "group-hover:scale-110"}
        `}
                    width={40}
                    height={40}
                    strokeWidth={2.5}
                  />
                </div>

                {/* Text Label with responsive visibility */}
                <span
                  className="
      mt-2 text-sm font-medium text-gray-600 
      group-hover:text-blue-600
      hidden sm:block
    "
                >
                  Add Photo
                </span>
              </div>

              {/* Hover Overlay */}
              <div
                className="
    absolute inset-0 rounded-full 
    bg-black/5 opacity-0 
    group-hover:opacity-100 
    transition-opacity duration-300
  "
              />

              {/* Loading State */}
              {isLoading && (
                <div
                  className="
      absolute inset-0 rounded-full 
      bg-white/80 flex items-center justify-center
    "
                >
                  <Spinner className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
              )}
            </div>
          );
        }
        if (type === "book") {
          return (
            <div
              aria-disabled={isLoading}
              onClick={() => open()}
              className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-blue-600 transition-colors group"
            >
              <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mb-2" />
              <span className="text-gray-600 group-hover:text-blue-600 text-sm">
                Click to upload cover image
              </span>
            </div>
          );
        }
        return <div>Upload</div>;
      }}
    </CldUploadWidget>
  );
};

const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
