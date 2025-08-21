import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonInput, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-otp-form',
  templateUrl: './otp-form.component.html',
  styleUrls: ['./otp-form.component.scss'],
})
export class OtpFormComponent implements OnInit {

  // Constantes
  private readonly MAX_OTP_LENGTH = 5;
  private readonly MAX_TIME_MINUTES = 1;
  private readonly MAX_TIME_SECONDS = this.MAX_TIME_MINUTES * 60;

  // Inputs del componente
  @Input() title: string = 'Ingresa el código de verificación';
  @Input() subtitle: string = 'Te hemos enviado un código a tu número de teléfono';
  @Input() resendText: string = 'Reenviar código';
  @Input() verifyText: string = 'Verificar código';
  @Input() timeExpiredText: string = 'Código expirado';
  @Input() clearText: string = 'Limpiar';
  @Input() autoValidate: boolean = true;

  // Outputs del componente
  @Output() otpComplete = new EventEmitter<string>();
  @Output() otpResend = new EventEmitter<void>();
  @Output() timeExpired = new EventEmitter<void>();

  // ViewChildren para acceder a los inputs
  @ViewChildren('otpInput') otpInputs!: QueryList<IonInput>;

  public formCodeOtp: FormGroup;

  public timeLeft: number = this.MAX_TIME_SECONDS;
  public formattedTime: string = '';
  public canResend: boolean = false;
  public isLoading: boolean = false;
  private timerInterval: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _alertController: AlertController,
    private _loadingController: LoadingController,
    private _router: Router,
  ) {
    this.renderFormBuilder();
  }

  ngOnInit() {
    this.startTimer();
  }

  renderFormBuilder() {
    this.formCodeOtp = this._formBuilder.group({
      code: this._formBuilder.array([])
    });

    this.createOtpControls();
  }

  createOtpControls() {
    const codeArray = this.formCodeOtp.get('code') as FormArray;
    codeArray.clear();

    for (let i = 0; i < this.MAX_OTP_LENGTH; i++) {
      codeArray.push(this.createOtpControl());
    }
  }

  createOtpControl(): FormControl {
    return this._formBuilder.control('', [
      Validators.required,
      Validators.pattern(/^\d$/)
    ]);
  }

  get codeControl(): FormArray {
    return this.formCodeOtp.get('code') as FormArray;
  }

  get maxOtpLength(): number {
    return this.MAX_OTP_LENGTH;
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const key = event.key;

    if (key === 'Backspace') {
      this.codeControl.at(index).setValue('');
      if (index > 0) this.focusInput(index - 1);
      return;
    }

    if (/^[0-9]$/.test(key)) {
      this.codeControl.at(index).setValue(key);
      if (index < this.MAX_OTP_LENGTH - 1) this.focusInput(index + 1);
    }

    event.preventDefault();
  }

  onPaste(event: ClipboardEvent, index: number) {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text') || '';
    const digits = paste.replace(/\D/g, '').slice(0, this.MAX_OTP_LENGTH);

    for (let i = 0; i < digits.length && i < this.MAX_OTP_LENGTH; i++) {
      this.codeControl.at(i).setValue(digits[i]);
    }

    const nextEmptyIndex = Math.min(index + digits.length, this.MAX_OTP_LENGTH - 1);
    const nextInput = this.otpInputs.toArray()[nextEmptyIndex];
    if (nextInput) {
      nextInput.setFocus();
    }

    this.checkIfCodeComplete();
  }

  private checkIfCodeComplete() {
    const code = this.getOtpCode();
    return code.length === this.MAX_OTP_LENGTH;
  }

  private getOtpCode(): string {
    return this.codeControl.controls
      .map(control => control.value || '')
      .join('');
  }

  private focusInput(index: number): void {
    setTimeout(() => {
      const inputs = this.otpInputs.toArray();
      if (inputs[index]) {
        inputs[index].setFocus();
      }
    }, 50);
  }

  private startTimer(): void {
    this.clearTimer();
    this.canResend = false;
    this.timeLeft = this.MAX_TIME_SECONDS;
    this.updateFormattedTime();

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateFormattedTime();

      if (this.timeLeft <= 0) {
        this.clearTimer();
        this.canResend = true;

        // Emitir evento de expireacion
        this.timeExpired.emit();
      }
    }, 1000);
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private updateFormattedTime(): void {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  public resendCode(): void {
    if (this.canResend && !this.isLoading) {
      this.isLoading = true;
      this.resendOtp();

      // Emitir evento de reenvio
      this.otpResend.emit();

      // Simular delay de reenvío
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }
  }

  clearOtp() {
    this.codeControl.controls.forEach(control => {
      control.setValue('');
      control.markAsUntouched();
    });

    setTimeout(() => {
      const firstInput = this.otpInputs.toArray()[0];
      if (firstInput) {
        firstInput.setFocus();
      }
    }, 100);
  }

  async resendOtp() {
    const loading = await this._loadingController.create({
      message: 'Reenviando código...',
      spinner: 'crescent'
    });

    await loading.present();

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await loading.dismiss();

      this.clearOtp();
      this.startTimer();
      this.showAlert('Código reenviado', `Se ha enviado un nuevo código`);
    } catch (error) {
      await loading.dismiss();
      this.showAlert('Error', 'Error al reenviar el código. Intenta nuevamente.');
    }
  }

  private async showAlert(header: string, message: string, callback?: () => void) {
    const alert = await this._alertController.create({
      header,
      message,
      buttons: [{
        text: 'OK',
        handler: callback
      }]
    });
    await alert.present();
  }

  onSubmit() {
    if (!this.checkIfCodeComplete()) {
      this.showAlert('Error', 'Por favor ingresa todos los dígitos del código OTP');
      return;
    }

    this.verifyOtp();
  }

  async verifyOtp() {

    const loading = await this._loadingController.create({
      message: 'Verificando código...',
      spinner: 'crescent'
    });

    await loading.present();

    try {

      const otpCode = this.getOtpCode();
      const isValid = await this.validateOtpWithServer(otpCode);

      await loading.dismiss();

      if (!isValid) {
        this.showAlert('Error', 'Código incorrecto. Intenta nuevamente.');
        this.clearOtp();
        return;
      }

      this.showAlert('Éxito', 'Código verificado correctamente', () => {
        this._router.navigate(['/']);
      });
    } catch (error) {
      await loading.dismiss();
      this.showAlert('Error', 'Error al verificar el código. Intenta nuevamente.');
    }
  }

  private validateOtpWithServer(otpCode: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(otpCode === '12345');
      }, 2000);
    });
  }

  get isCodeOtpValid(): boolean {
    return (this.formCodeOtp.invalid && !this.checkIfCodeComplete())
      || this.canResend;
  }
}


