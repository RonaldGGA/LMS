import { Plus, UploadCloud } from "lucide-react";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
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
        sources: ["local"],
        resourceType: "image",
        clientAllowedFormats: [
          "jpg",
          "jpeg",
          "png",
          "webp",
          "jfif",
          "avif",
          "svg",
          "svg+xml",
        ],
        maxFileSize: 5000000, // 5MB
        showAdvancedOptions: false,
        showUploadMoreButton: false,
        styles: {
          palette: {
            window: "#ffffff",
            windowBorder: "#e0e0e0",
            tabIcon: "library-midnight",
            menuIcons: "library-midnight",
            textDark: "#1f2937",
            textLight: "#ffffff",
            link: "library-midnight",
            action: "antique-gold",
            inactiveTabIcon: "#9ca3af",
            error: "#dc2626",
            inProgress: "library-midnight",
            complete: "#16a34a",
          },
          frame: {
            background: "transparent",
          },
          fonts: {
            default: null,
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
    border-2 border-dashed border-antique-gold  
    flex flex-col items-center justify-center   
    cursor-pointer hover:border-library-midnight hover:scale-[1.02]  
    focus:outline-none focus:ring-2 focus:ring-antique-gold focus:ring-offset-2  
    transition-all duration-300 ease-in-out  
    group shadow-sm hover:shadow-md  
    ${isLoading ? "opacity-70 cursor-not-allowed" : ""}  
  `}
              role="button"
              tabIndex={0}
              aria-label="Upload profile photo"
            >
              <div className="relative flex flex-col items-center">
                <div
                  className="  
      p-3 rounded-full  
      bg-ivory-cream group-hover:bg-antique-gold  
      transition-colors duration-300  
      flex items-center justify-center  
    "
                >
                  <Plus
                    className={`  
          text-library-midnight group-hover:text-ivory-cream  
          transition-all duration-300  
          ${!isLoading && "group-hover:scale-110"}  
        `}
                    width={40}
                    height={40}
                    strokeWidth={2.5}
                  />
                </div>

                <span
                  className="  
      mt-2 text-sm font-medium text-library-midnight   
      group-hover:text-antique-gold  
      hidden sm:block  
    "
                >
                  Add Photo
                </span>
              </div>

              <div
                className="  
    absolute inset-0 rounded-full   
    bg-black/5 opacity-0   
    group-hover:opacity-100   
    transition-opacity duration-300  
  "
              />

              {isLoading && (
                <div
                  className="  
      absolute inset-0 rounded-full   
      bg-white/80 flex items-center justify-center  
    "
                >
                  <Spinner className="w-8 h-8 text-antique-gold animate-spin" />
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
              className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-antique-gold/40 rounded-lg cursor-pointer hover:border-library-midnight transition-colors group"
            >
              <UploadCloud className="w-8 h-8 text-gray-200/40 group-hover:text-antique-gold mb-2" />
              <span className="text-gray-200/40 group-hover:text-antique-gold text-sm">
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
