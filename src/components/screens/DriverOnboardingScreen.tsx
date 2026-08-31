import React, { useState } from 'react';
import { 
  FileCheck, 
  UploadCloud, 
  Check, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  Car, 
  User, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Trash2, 
  AlertTriangle,
  ExternalLink,
  Plus
} from 'lucide-react';
import { MOCK_DRIVER_DOCUMENTS, MOCK_DRIVER_VEHICLES } from '../../data/mockData';
import { DriverDocument, DriverVehicle } from '../../types';

interface DriverOnboardingScreenProps {
  onBack: () => void;
  onFinishOnboarding: () => void;
}

export const DriverOnboardingScreen: React.FC<DriverOnboardingScreenProps> = ({
  onBack,
  onFinishOnboarding,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [documents, setDocuments] = useState<DriverDocument[]>(MOCK_DRIVER_DOCUMENTS);
  const [vehicles, setVehicles] = useState<DriverVehicle[]>(MOCK_DRIVER_VEHICLES);
  const [personalData, setPersonalData] = useState({
    fullName: 'Martín Gómez',
    dni: '38.452.190',
    birthDate: '1995-04-12',
    legalAddress: 'Av. 25 de Mayo 1240, Formosa Capital',
    electronicAddress: 'martin.gomez.chofer@formosa.ar',
    phone: '+54 370 455-8921',
  });

  const [contractAccepted, setContractAccepted] = useState(true);
  const [guideDogPolicyAccepted, setGuideDogPolicyAccepted] = useState(true);
  const [childSupportAccepted, setChildSupportAccepted] = useState(true);

  // New vehicle form
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    brand: '',
    model: '',
    year: 2023,
    color: 'Blanco Reglamentario',
    plate: '',
  });

  const handleFileUpload = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              status: 'en_revision',
              fileName: file.name,
              semaphore: 'verde',
              feedback: 'Documento subido correctamente. En cola de revisión del Administrador.',
            }
          : doc
      )
    );
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.brand || !newVehicle.model || !newVehicle.plate) return;
    if (vehicles.length >= 3) return;

    const added: DriverVehicle = {
      id: `veh-${Date.now()}`,
      brand: newVehicle.brand,
      model: newVehicle.model,
      year: Number(newVehicle.year),
      color: newVehicle.color,
      plate: newVehicle.plate.toUpperCase(),
      isActive: false,
      category: 'bear-drive',
      insuranceStatus: 'al_dia',
      rtoStatus: 'al_dia',
    };

    setVehicles([...vehicles, added]);
    setShowAddVehicle(false);
    setNewVehicle({ brand: '', model: '', year: 2023, color: 'Blanco Reglamentario', plate: '' });
  };

  const approvedCount = documents.filter((d) => d.status === 'aprobado').length;
  const progressPercent = Math.round((approvedCount / documents.length) * 100);

  return (
    <div className="flex-1 flex flex-col bg-[#081226] text-white p-4 max-w-4xl mx-auto w-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#33405A]/60 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#15213A] border border-[#33405A] text-xs font-semibold text-white hover:bg-[#202D47] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#F5B51B]" />
          <span>Volver</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[11px] text-[#AEB7C8] block">Estado de Habilitación</span>
            <span className="text-xs font-extrabold text-[#59C878] flex items-center gap-1 justify-end">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{approvedCount}/{documents.length} Requisitos Validados</span>
            </span>
          </div>
        </div>
      </div>

      {/* Progress Wizard Steps */}
      <div className="mb-6 p-4 rounded-2xl bg-[#0D1930] border border-[#33405A]">
        <div className="flex items-center justify-between gap-2 mb-3">
          {[
            { num: 1, title: 'Datos Personales', icon: User },
            { num: 2, title: 'Documentación Oficial', icon: FileText },
            { num: 3, title: 'Vehículos (Hasta 3)', icon: Car },
            { num: 4, title: 'Contrato & Habilitación', icon: ShieldCheck },
          ].map((s) => {
            const Icon = s.icon;
            const isCurrent = currentStep === s.num;
            const isCompleted = currentStep > s.num;

            return (
              <div
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`flex-1 flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-[#15213A] border border-[#F5B51B] text-[#F5B51B]'
                    : isCompleted
                    ? 'bg-[#15213A]/50 text-[#59C878]'
                    : 'text-[#AEB7C8] hover:text-white'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCurrent
                      ? 'bg-[#F5B51B] text-[#081226]'
                      : isCompleted
                      ? 'bg-[#59C878] text-[#081226]'
                      : 'bg-[#0D1930] border border-[#33405A]'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <div className="hidden sm:block min-w-0">
                  <div className="text-[11px] font-bold truncate">{s.title}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Linear progress bar */}
        <div className="w-full bg-[#15213A] h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#F5B51B] to-[#59C878] h-full transition-all duration-300"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: DATOS PERSONALES & DOMICILIO */}
      {currentStep === 1 && (
        <div className="p-6 rounded-3xl bg-[#15213A] border border-[#33405A] shadow-xl space-y-4">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Paso 1: Datos Personales & Domicilio Legal</h3>
            <p className="text-xs text-[#AEB7C8]">
              Los datos deben coincidir exactamente con el DNI y la Licencia Nacional D1 emitida en Formosa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-[11px] font-bold uppercase text-[#AEB7C8] block mb-1">Nombre Completo</label>
              <input
                type="text"
                value={personalData.fullName}
                onChange={(e) => setPersonalData({ ...personalData, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1930] border border-[#33405A] text-sm text-white focus:outline-none focus:border-[#F5B51B]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-[#AEB7C8] block mb-1">DNI / CUIL</label>
              <input
                type="text"
                value={personalData.dni}
                onChange={(e) => setPersonalData({ ...personalData, dni: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1930] border border-[#33405A] text-sm text-white focus:outline-none focus:border-[#F5B51B]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-[#AEB7C8] block mb-1">Domicilio Legal (Formosa)</label>
              <input
                type="text"
                value={personalData.legalAddress}
                onChange={(e) => setPersonalData({ ...personalData, legalAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1930] border border-[#33405A] text-sm text-white focus:outline-none focus:border-[#F5B51B]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-[#AEB7C8] block mb-1">Domicilio Electrónico (E-mail)</label>
              <input
                type="email"
                value={personalData.electronicAddress}
                onChange={(e) => setPersonalData({ ...personalData, electronicAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1930] border border-[#33405A] text-sm text-white focus:outline-none focus:border-[#F5B51B]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-[#AEB7C8] block mb-1">Teléfono de Contacto</label>
              <input
                type="tel"
                value={personalData.phone}
                onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1930] border border-[#33405A] text-sm text-white focus:outline-none focus:border-[#F5B51B]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-[#AEB7C8] block mb-1">Fecha de Nacimiento</label>
              <input
                type="date"
                value={personalData.birthDate}
                onChange={(e) => setPersonalData({ ...personalData, birthDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1930] border border-[#33405A] text-sm text-white focus:outline-none focus:border-[#F5B51B]"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-2xl bg-[#F5B51B] hover:bg-[#FFBE22] text-[#081226] font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <span>Continuar a Documentación</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DOCUMENTACIÓN OFICIAL (8 REQUISITOS FORMOSA) */}
      {currentStep === 2 && (
        <div className="p-6 rounded-3xl bg-[#15213A] border border-[#33405A] shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white mb-0.5">
                Paso 2: Documentación Obligatoria (Normativa Formosa)
              </h3>
              <p className="text-xs text-[#AEB7C8]">
                Control estricto con semáforo de vencimientos: Verde (&gt;30d), Amarillo (&lt;15d), Rojo (Vencido).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] text-[#59C878]">
                <span className="w-2 h-2 rounded-full bg-[#59C878]" /> Al día
              </span>
              <span className="flex items-center gap-1 text-[10px] text-[#F5B51B]">
                <span className="w-2 h-2 rounded-full bg-[#F5B51B]" /> Por vencer
              </span>
              <span className="flex items-center gap-1 text-[10px] text-[#FF4B4B]">
                <span className="w-2 h-2 rounded-full bg-[#FF4B4B]" /> Vencido
              </span>
            </div>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {documents.map((doc) => {
              const semColor =
                doc.semaphore === 'verde' ? '#59C878' : doc.semaphore === 'amarillo' ? '#F5B51B' : '#FF4B4B';

              return (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl bg-[#0D1930] border border-[#33405A] hover:border-[#33405A] transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${semColor}20`, color: semColor }}
                    >
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white truncate">{doc.title}</span>
                        {doc.isRequired && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#F5B51B]/20 text-[#F5B51B]">
                            REQUERIDO
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[#AEB7C8] truncate">
                        Archivo: <strong className="text-white font-mono">{doc.fileName || 'No subido'}</strong>
                      </span>
                      {doc.expiresAt && (
                        <span className="text-[11px] text-[#AEB7C8] flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-[#F5B51B]" />
                          <span>Vence: {doc.expiresAt}</span>
                          {doc.daysToExpiry !== undefined && (
                            <span style={{ color: semColor }}>({doc.daysToExpiry} días)</span>
                          )}
                        </span>
                      )}
                      {doc.feedback && (
                        <span className="text-[11px] text-[#F5B51B] mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{doc.feedback}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <span
                      className="text-xs font-bold uppercase px-2.5 py-1 rounded-full text-center"
                      style={{
                        backgroundColor: `${semColor}20`,
                        color: semColor,
                      }}
                    >
                      {doc.status.replace('_', ' ')}
                    </span>

                    <label className="px-3.5 py-2 rounded-xl bg-[#15213A] hover:bg-[#202D47] border border-[#33405A] text-xs font-bold text-white cursor-pointer transition-all flex items-center gap-1.5 shadow-sm">
                      <UploadCloud className="w-4 h-4 text-[#F5B51B]" />
                      <span>{doc.fileName ? 'Reemplazar' : 'Subir'}</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileUpload(doc.id, e)}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#33405A]/60">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl bg-[#15213A] border border-[#33405A] text-xs font-bold text-white hover:bg-[#202D47]"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-2xl bg-[#F5B51B] hover:bg-[#FFBE22] text-[#081226] font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <span>Continuar a Vehículos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REGISTRO DE VEHÍCULOS (HASTA 3 AUTOS) */}
      {currentStep === 3 && (
        <div className="p-6 rounded-3xl bg-[#15213A] border border-[#33405A] shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-white mb-0.5">Paso 3: Flota de Vehículos</h3>
              <p className="text-xs text-[#AEB7C8]">
                Puedes registrar hasta 3 autos. Uno solo queda activo para operar en el momento.
              </p>
            </div>
            {vehicles.length < 3 && (
              <button
                type="button"
                onClick={() => setShowAddVehicle(!showAddVehicle)}
                className="px-3.5 py-2 rounded-xl bg-[#F5B51B] text-[#081226] text-xs font-bold hover:bg-[#FFBE22] flex items-center gap-1.5 self-start"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Vehículo ({vehicles.length}/3)</span>
              </button>
            )}
          </div>

          {/* Add Vehicle Modal / Form */}
          {showAddVehicle && (
            <form onSubmit={handleAddVehicle} className="p-4 rounded-2xl bg-[#0D1930] border-2 border-[#F5B51B] space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[#F5B51B]">
                Nuevo Vehículo (Reglamentación Formosa)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] text-[#AEB7C8] uppercase font-bold block mb-1">Marca</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Toyota, Chevrolet"
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15213A] border border-[#33405A] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#AEB7C8] uppercase font-bold block mb-1">Modelo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Etios Sedan"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15213A] border border-[#33405A] text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#AEB7C8] uppercase font-bold block mb-1">Patente</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. AF 123 ZZ"
                    value={newVehicle.plate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, plate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15213A] border border-[#33405A] text-xs text-white uppercase"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#AEB7C8] uppercase font-bold block mb-1">Año</label>
                  <input
                    type="number"
                    min={2015}
                    max={2026}
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#15213A] border border-[#33405A] text-xs text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVehicle(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#15213A] text-xs text-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#F5B51B] text-[#081226] text-xs font-bold"
                >
                  Guardar Vehículo
                </button>
              </div>
            </form>
          )}

          {/* Vehicles List */}
          <div className="grid grid-cols-1 gap-3">
            {vehicles.map((veh) => (
              <div
                key={veh.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  veh.isActive
                    ? 'bg-[#15213A] border-2 border-[#59C878] shadow-[0_0_15px_rgba(89,200,120,0.15)]'
                    : 'bg-[#0D1930] border-[#33405A]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#081226] border border-[#33405A] flex items-center justify-center text-white shrink-0">
                    <Car className="w-6 h-6 text-[#F5B51B]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {veh.brand} {veh.model} ({veh.year})
                      </span>
                      {veh.isActive && (
                        <span className="px-2 py-0.5 rounded-md bg-[#59C878] text-[#081226] text-[10px] font-black uppercase">
                          ACTIVO EN VIAJES
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#AEB7C8] block font-mono">
                      Patente: <strong className="text-white">{veh.plate}</strong> • {veh.color}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-[#59C878] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Seguro al día
                      </span>
                      <span className="text-[11px] text-[#59C878] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> RTO Vigente
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!veh.isActive && (
                    <button
                      type="button"
                      onClick={() =>
                        setVehicles(
                          vehicles.map((v) => ({
                            ...v,
                            isActive: v.id === veh.id,
                          }))
                        )
                      }
                      className="px-3 py-1.5 rounded-xl bg-[#15213A] border border-[#33405A] text-xs text-white hover:border-[#59C878]"
                    >
                      Activar este auto
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#33405A]/60">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl bg-[#15213A] border border-[#33405A] text-xs font-bold text-white hover:bg-[#202D47]"
            >
              Atrás
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 rounded-2xl bg-[#F5B51B] hover:bg-[#FFBE22] text-[#081226] font-bold text-sm flex items-center gap-2 shadow-lg transition-all"
            >
              <span>Continuar a Contrato</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CONTRATO & FIRMA DIGITAL */}
      {currentStep === 4 && (
        <div className="p-6 rounded-3xl bg-[#15213A] border border-[#33405A] shadow-xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-white mb-1">
              Paso 4: Contrato de Prestación de Servicios Autónomos
            </h3>
            <p className="text-xs text-[#AEB7C8]">
              BearDrive S.A.S. • Marco regulatorio de movilidad en Formosa Capital
            </p>
          </div>

          {/* Legal Checklist Declarations */}
          <div className="space-y-3">
            <label className="p-4 rounded-2xl bg-[#0D1930] border border-[#33405A] flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={contractAccepted}
                onChange={(e) => setContractAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[#F5B51B] focus:ring-0"
              />
              <div className="text-xs text-[#AEB7C8] leading-relaxed">
                <strong className="text-white block mb-0.5">Contrato de Locación de Servicios Independientes:</strong>
                Declaro que presto el servicio con total autonomía operativa, vehículo propio habilitado, sin exclusividad ni relación de dependencia laboral, y acepto el régimen de cobro diario configurable de BearDrive.
              </div>
            </label>

            <label className="p-4 rounded-2xl bg-[#0D1930] border border-[#33405A] flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={guideDogPolicyAccepted}
                onChange={(e) => setGuideDogPolicyAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[#F5B51B] focus:ring-0"
              />
              <div className="text-xs text-[#AEB7C8] leading-relaxed">
                <strong className="text-white block mb-0.5">Compromiso con Perros Guía (Ley de Discapacidad):</strong>
                Acepto de manera obligatoria e irrestricta permitir el traslado de personas acompañadas por perros guía de asistencia sin ningún costo adicional.
              </div>
            </label>

            <label className="p-4 rounded-2xl bg-[#0D1930] border border-[#33405A] flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={childSupportAccepted}
                onChange={(e) => setChildSupportAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-[#F5B51B] focus:ring-0"
              />
              <div className="text-xs text-[#AEB7C8] leading-relaxed">
                <strong className="text-white block mb-0.5">Declaración Jurada de Deudores Alimentarios:</strong>
                Declaro bajo juramento no encontrarme inscripto en el Registro de Deudores Alimentarios Morosos.
              </div>
            </label>
          </div>

          <div className="p-4 rounded-2xl bg-[#59C878]/10 border border-[#59C878]/40 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#59C878] shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-white block">Todo listo para operar</span>
              <span className="text-[#AEB7C8]">
                Al confirmar, se activará tu cuenta para recibir viajes en Formosa Capital.
              </span>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-[#33405A]/60">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl bg-[#15213A] border border-[#33405A] text-xs font-bold text-white hover:bg-[#202D47]"
            >
              Atrás
            </button>
            <button
              type="button"
              disabled={!contractAccepted || !guideDogPolicyAccepted || !childSupportAccepted}
              onClick={onFinishOnboarding}
              className="px-6 py-3.5 rounded-2xl bg-[#59C878] hover:bg-[#4EAF68] disabled:opacity-50 text-[#081226] font-black text-sm flex items-center gap-2 shadow-xl transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              <span>Ingresar al Modo Conductor</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
