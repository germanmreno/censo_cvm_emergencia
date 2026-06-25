import { useState } from 'react';
import { Phone, Shield, Building2, Flame, ChevronDown, PhoneCall, AlertTriangle } from 'lucide-react';
import { Card, CardHeader } from './ui/Card';
import { Badge } from './ui/Badge';
import { emergencyContacts, telHref } from '../data/emergencyContacts';

const ICONS = {
  shield: Shield,
  building: Building2,
  flame: Flame,
  phone: Phone,
};

function ContactGroup({ group }) {
  const Icon = ICONS[group.icon] || Phone;
  return (
    <div className="bg-white border border-slate-200 rounded-md p-3 hover:border-cvm-emergency/40 transition">
      <div className="flex items-start gap-2 mb-2">
        <div className="h-7 w-7 rounded bg-red-50 text-cvm-emergency flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <h4 className="text-sm font-semibold text-cvm-secondary leading-tight pt-0.5">
          {group.name}
        </h4>
      </div>
      <ul className="space-y-1 pl-9">
        {group.phones.map((phone, i) => (
          <li key={i}>
            <a
              href={telHref(phone)}
              className="inline-flex items-center gap-1.5 text-sm font-mono font-semibold text-cvm-emergency hover:text-cvm-emergency-dark hover:underline"
            >
              <PhoneCall className="h-3 w-3" />
              {phone}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function EmergencyContacts({ variant = 'full', defaultOpen = true, title }) {
  const [open, setOpen] = useState(defaultOpen);

  if (variant === 'compact') {
    return (
      <div className="border border-cvm-emergency/30 rounded-md bg-red-50/40">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left"
        >
          <span className="flex items-center gap-2 text-cvm-emergency font-semibold text-sm">
            <AlertTriangle className="h-4 w-4" />
            {title || 'Teléfonos de emergencia'}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-cvm-emergency transition-transform ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>
        {open && (
          <div className="px-3 pb-3">
            <div className="grid sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {emergencyContacts.map((g) => (
                <ContactGroup key={g.id} group={g} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'success') {
    return (
      <div className="border-2 border-cvm-emergency/40 rounded-lg bg-white">
        <div className="bg-cvm-emergency text-white px-4 py-2.5 flex items-center gap-2 rounded-t-lg">
          <AlertTriangle className="h-4 w-4" />
          <h3 className="font-bold text-sm">Guarde estos teléfonos de emergencia</h3>
        </div>
        <div className="p-3 max-h-64 overflow-y-auto">
          <div className="grid sm:grid-cols-2 gap-2">
            {emergencyContacts.map((g) => (
              <ContactGroup key={g.id} group={g} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const proteccionCivil = emergencyContacts.filter((c) => c.id === 'proteccion-civil');
  const instituto = emergencyContacts.filter((c) => c.id === 'instituto-proteccion-civil');
  const defensa = emergencyContacts.filter(
    (c) => c.id === 'defensa-civil-alcaldia' || c.id === 'defensa-civil-nacional',
  );
  const bomberos = emergencyContacts.filter((c) => c.id.startsWith('bomberos-'));

  return (
    <Card>
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-cvm-emergency" />
            Teléfonos de emergencia
          </span>
        }
        description="Si su vida corre peligro inmediato, contacte primero a Protección Civil. Mantenga esta información a la mano."
        action={<Badge variant="emergency">Líneas activas 24/7</Badge>}
      />
      <div className="space-y-5">
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-cvm-emergency mb-2">
            Protección Civil
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...proteccionCivil, ...instituto, ...defensa].map((g) => (
              <ContactGroup key={g.id} group={g} />
            ))}
          </div>
        </section>
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-cvm-emergency mb-2">
            Cuerpos de Bomberos
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bomberos.map((g) => (
              <ContactGroup key={g.id} group={g} />
            ))}
          </div>
        </section>
      </div>
    </Card>
  );
}
