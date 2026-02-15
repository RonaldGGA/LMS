"use client";

import { useState } from "react";
import { Copy, X, Key, User } from "lucide-react";

export default function DemoCredentialsFloater() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);


  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1500);
  };

  const credentials = [
    {
      role: "Admin",
      username: "admin_system",
      password: "password123",
      color: "bg-yellow-500/10 border-yellow-500/30",
    },
    {
      role: "Test User",
      username: "john_reader",
      password: "password123",
      color: "bg-black/20 border-gray-700",
    },
  ];

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div
        className={`
          relative transition-all duration-300 ease-in-out
          ${
            isExpanded
              ? "w-96 opacity-100"
              : "w-20 opacity-90 hover:opacity-100 hover:w-24"
          }
        `}
      >
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-2 -right-2 z-50 w-6 h-6 rounded-full 
                   bg-black border border-yellow-500/50 flex items-center 
                   justify-center hover:bg-yellow-500/20 transition-colors"
          aria-label="Close demo credentials"
        >
          <X size={12} className="text-yellow-400" />
        </button>

        {isExpanded ? (
          <div
            className="bg-black/95 backdrop-blur-sm border border-yellow-500/30 
                       rounded-lg shadow-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Key size={14} className="text-yellow-400" />
                <span className="text-xs font-medium text-yellow-400">
                  Demo Credentials
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label="Collapse"
              >
                <X size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {credentials.map((cred) => (
                <div
                  key={cred.role}
                  className={`p-3 rounded border ${cred.color}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-yellow-300">
                      {cred.role}
                    </span>
                    {copied === cred.role && (
                      <span className="text-xs text-green-400 animate-pulse">
                        Copied!
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <User size={10} className="text-gray-400" />
                        <span className="text-xs text-gray-300">User:</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <code className="text-xs text-white font-mono">
                          {cred.username}
                        </code>
                        <button
                          onClick={() =>
                            copyToClipboard(cred.username, cred.role)
                          }
                          className="p-1 hover:bg-yellow-500/10 rounded transition-colors"
                          aria-label={`Copy ${cred.role} username`}
                        >
                          <Copy size={10} className="text-yellow-400" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Key size={10} className="text-gray-400" />
                        <span className="text-xs text-gray-300">Pass:</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <code className="text-xs text-white font-mono">
                          ••••••••
                        </code>
                        <button
                          onClick={() =>
                            copyToClipboard(cred.password, cred.role)
                          }
                          className="p-1 hover:bg-yellow-500/10 rounded transition-colors"
                          aria-label={`Copy ${cred.role} password`}
                        >
                          <Copy size={10} className="text-yellow-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-gray-800">
                <p className="text-[10px] text-gray-400 leading-tight">
                  Use these accounts to explore different user roles and
                  permissions.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full h-12 rounded-lg bg-black/95 backdrop-blur-sm 
                     border border-yellow-500/30 flex items-center justify-center 
                     hover:border-yellow-400/50 hover:scale-105 transition-all
                     shadow-lg"
            aria-label="Show demo credentials"
          >
            <div className="flex items-center gap-1.5">
              <Key size={16} className="text-yellow-400" />
              <span className="text-xs text-yellow-400 font-medium truncate">
                Demo
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
