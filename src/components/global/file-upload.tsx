/* eslint-disable @typescript-eslint/no-unused-vars */
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

interface FileUploadProps {
  apiEndpoint: "agencyLogo" | "avatar" | "subaccoungLogo";
  onChange: (url?: string) => void;
  value?: string;
}
const FileUpload = ({ apiEndpoint, onChange, value }: FileUploadProps) => {
  const type = value?.split(".").pop();

  if (value) {
    return (
      <div className="flex flex-col items-center justify-center">
        {type !== "pdf" ? (
          <div className="relative w-40 h-40">
            <Image src={value} alt="imagem" className="object-contain" fill />
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/100">
            <FileIcon className="w-4 h-4 mr-2" />
            <a
              href={value}
              target="_blank"
              className="ml-2 text-sm text-indigo/500 dark>text-indigo/400 hover:underline"
              rel="noopener_noreferrer"
            >
              View PDF
            </a>
          </div>
        )}
        <Button variant="ghost" type="button" onClick={() => onChange("")}>
          <X className="w-4 h-4 mr-2" />
          Remover logo
        </Button>
      </div>
    );
  }
  return <div className="w-full bg-muted/30"></div>;
};

export default FileUpload;
