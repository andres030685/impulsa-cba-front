import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CrearLeadRequest, ObjetivoMejora, TamanioEquipo } from '../../models';

@Component({
  selector: 'app-lead-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="form-section" id="lead-form" aria-labelledby="form-title">
      <div class="form-section__content">
        <h2 class="form-section__title" id="form-title">Analizá tu negocio</h2>
        <p class="form-section__subtitle">Completá estos datos y te hacemos un diagnóstico rápido por WhatsApp</p>

        <form class="form" (ngSubmit)="onSubmit()" #leadForm="ngForm">
          <div class="form__field">
            <label for="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              [(ngModel)]="formData.nombre"
              name="nombre"
              required
              placeholder="Tu nombre"
            />
          </div>

          <div class="form__field">
            <label for="nombreNegocio">Nombre del negocio</label>
            <input
              id="nombreNegocio"
              type="text"
              [(ngModel)]="formData.nombre_negocio"
              name="nombreNegocio"
              required
              placeholder="Ej: Panadería Don Luis"
            />
          </div>

          <div class="form__field">
            <label for="rubro">Rubro del negocio</label>
            <input
              id="rubro"
              type="text"
              [(ngModel)]="formData.rubro"
              name="rubro"
              required
              placeholder="Ej: Gastronomía, Servicios, Comercio..."
            />
          </div>

          <div class="form__field">
            <label>¿Qué querés mejorar hoy?</label>
            <div class="form__checks">
              @for (option of opcionesObjetivo; track option.value) {
                <label class="form__check" [class.form__check--active]="formData.objetivos_mejora.includes(option.value)">
                  <input
                    type="checkbox"
                    [checked]="formData.objetivos_mejora.includes(option.value)"
                    (change)="toggleObjetivo(option.value)"
                  />
                  <span class="form__check-box"></span>
                  <span>{{ option.label }}</span>
                </label>
              }
            </div>
          </div>

          <div class="form__field">
            <label for="tamanioEquipo">¿Cuántas personas trabajan en el negocio?</label>
            <select
              id="tamanioEquipo"
              [(ngModel)]="formData.tamanio_equipo"
              name="tamanioEquipo"
              required
            >
              <option value="" disabled>Seleccioná una opción</option>
              <option value="solo">Solo yo</option>
              <option value="2_a_5">2 a 5</option>
              <option value="6_a_15">6 a 15</option>
              <option value="mas_de_15">Más de 15</option>
            </select>
          </div>

          <div class="form__field">
            <label for="telefono">Teléfono (WhatsApp)</label>
            <input
              id="telefono"
              type="tel"
              [(ngModel)]="formData.telefono"
              name="telefono"
              required
              placeholder="Ej: 351 1234567"
            />
          </div>

          <button
            class="form__submit"
            type="submit"
            [disabled]="!leadForm.valid || formData.objetivos_mejora.length === 0 || submitting() || isSubmitting()"
          >
            @if (isSubmitting()) {
              <span class="form__submit-spinner"></span>
              Preparando diagnóstico...
            } @else {
              {{ submitting() ? 'Enviando...' : 'Quiero mi diagnóstico' }}
            }
          </button>
        </form>
      </div>
    </section>
  `,
  styleUrl: './lead-form.component.scss',
})
export class LeadFormComponent {
  formSubmit = output<CrearLeadRequest>();
  submitting = signal(false);
  isSubmitting = input(false);

  opcionesObjetivo: { value: ObjetivoMejora; label: string }[] = [
    { value: 'mas_clientes', label: 'Más clientes' },
    { value: 'ordenar', label: 'Ordenar el negocio' },
    { value: 'automatizar', label: 'Automatizar tareas' },
    { value: 'entender_numeros', label: 'Entender mejor los números' },
  ];

  formData = {
    nombre: '',
    nombre_negocio: '',
    rubro: '',
    objetivos_mejora: [] as ObjetivoMejora[],
    tamanio_equipo: '' as TamanioEquipo | '',
    telefono: '',
  };

  toggleObjetivo(objetivo: ObjetivoMejora): void {
    const index = this.formData.objetivos_mejora.indexOf(objetivo);
    if (index === -1) {
      this.formData.objetivos_mejora.push(objetivo);
    } else {
      this.formData.objetivos_mejora.splice(index, 1);
    }
  }

  onSubmit(): void {
    if (this.formData.objetivos_mejora.length === 0 || !this.formData.tamanio_equipo) return;

    this.formSubmit.emit({
      nombre: this.formData.nombre,
      nombre_negocio: this.formData.nombre_negocio,
      rubro: this.formData.rubro,
      objetivos_mejora: [...this.formData.objetivos_mejora],
      tamanio_equipo: this.formData.tamanio_equipo,
      telefono: this.formData.telefono,
    });
  }
}
