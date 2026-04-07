export const dynamic = 'force-dynamic';

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Plus,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import Link from 'next/link';

interface Field {
  id: string;
  label: string;
  type: 'text' | 'date' | 'signature' | 'checkbox';
  required: boolean;
}

export default function NewTemplatePage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'date', label: 'Date' },
    { value: 'signature', label: 'Signature' },
    { value: 'checkbox', label: 'Checkbox' },
  ] as const;

  const addField = () => {
    const newField: Field = {
      id: Date.now().toString(),
      label: '',
      type: 'text',
      required: false,
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (
    id: string,
    key: keyof Omit<Field, 'id'>,
    value: any
  ) => {
    setFields(
      fields.map((f) => (f.id === id ? { ...f, [key]: value } : f))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a template name');
      return;
    }

    if (fields.some((f) => !f.label.trim())) {
      alert('Please fill in all field labels');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          content: {
            fields,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error((errorData as Record<string, unknown>).message as string || 'Failed to create template');
      }

      router.push('/dashboard/templates');
    } catch (error: unknown) {
      console.error('Failed to create template:', error);
      alert(error instanceof Error ? error.message : 'Failed to create template');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/templates" className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Template</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Template Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., NDA Template"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this template is for..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Fields section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Document Fields
              </h2>
              <button
                onClick={addField}
                type="button"
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Field
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No fields yet</p>
                <button
                  onClick={addField}
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg hover:border-blue-600 text-gray-700 font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Field
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, idx) => (
                  <div
                    key={field.id}
                    className="p-4 border border-gray-200 rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        Field {idx + 1}
                      </h3>
                      {fields.length > 1 && (
                        <button
                          onClick={() => removeField(field.id)}
                          type="button"
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) =>
                            updateField(field.id, 'label', e.target.value)
                          }
                          placeholder="e.g., Full Name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={field.type}
                          onChange={(e) =>
                            updateField(
                              field.id,
                              'type',
                              e.target.value as Field['type']
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          {fieldTypes.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          updateField(field.id, 'required', e.target.checked)
                        }
                        className="rounded border-gray-300"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Required field
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
              <button
                onClick={() => setShowPreview(!showPreview)}
                type="button"
                className="p-1 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {showPreview ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {showPreview ? (
              <div className="space-y-4 mb-6">
                {name && (
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900">{name}</h3>
                    {description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {description}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-3 border-t border-gray-200 pt-4">
                  {fields.map((field) => (
                    <div key={field.id}>
                      <label className="text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required && (
                          <span className="text-red-600 ml-1">*</span>
                        )}
                      </label>
                      <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-500">
                        {field.type === 'signature'
                          ? 'Signature field'
                          : field.type === 'date'
                          ? 'Date field'
                          : field.type === 'checkbox'
                          ? 'Checkbox field'
                          : 'Text input'}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-gray-500 text-center mt-4">
                  {fields.length} field{fields.length !== 1 ? 's' : ''}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click to preview</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !name.trim() || fields.length === 0}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {submitting ? 'Creating...' : 'Create Template'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
