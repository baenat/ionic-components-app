import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonInput, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-otp-basic',
  templateUrl: './otp-basic.component.html',
  styleUrls: ['./otp-basic.component.scss'],
})
export class OtpBasicComponent implements OnInit {

  // Constantes
  private readonly MAX_OTP_LENGTH = 5;
  private readonly MAX_TIME_MINUTES = 1;
  private readonly MAX_TIME_SECONDS = this.MAX_TIME_MINUTES * 60;

  // Inputs del componente
  @Input() title: string = 'Ingresa el código de verificación';
  @Input() subtitle: string = 'Te hemos enviado un código a tu número de teléfono';
  @Input() resendText: string = 'Reenviar código';
  @Input() autoValidate: boolean = true;

  // Outputs del componente
  @Output() otpComplete = new EventEmitter<string>();
  @Output() otpResend = new EventEmitter<void>();
  @Output() timeExpired = new EventEmitter<void>();

  // ViewChildren para acceder a los inputs
  @ViewChildren('otpInput') otpInputs!: QueryList<IonInput>;

  // Variables del componente
  public otpDigits: string[] = new Array(this.MAX_OTP_LENGTH).fill('');
  public timeLeft: number = this.MAX_TIME_SECONDS;
  public formattedTime: string = '';
  public canResend: boolean = false;
  public isLoading: boolean = false;

  private timer: any;

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  ngOnInit() {
    this.startTimer();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  /**
   * Inicia el contador de tiempo
   */
  private startTimer(): void {
    this.timeLeft = this.MAX_TIME_SECONDS;
    this.canResend = false;
    this.updateFormattedTime();

    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateFormattedTime();

      if (this.timeLeft <= 0) {
        this.clearTimer();
        this.canResend = true;
        this.timeExpired.emit();
      }
    }, 1000);
  }

  /**
   * Detiene el contador
   */
  private clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Actualiza el formato del tiempo mostrado
   */
  private updateFormattedTime(): void {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Maneja el input de cada dígito
   */
  public onInput(event: any, index: number): void {
    const value = event.target.value;

    console.log({ value, index })

    // Solo permitir números
    const numericValue = value.replace(/[^0-9]/g, '');

    // Actualizar el array
    this.otpDigits[index] = numericValue;

    // Mover al siguiente input si hay valor
    if (numericValue && index < this.MAX_OTP_LENGTH - 1) {
      this.focusNext(index + 1);
    }

    // Validar si el OTP está completo
    console.log(this.isOtpComplete())
    if (this.isOtpComplete()) {
      this.validateOtp();
      this.verifyOtp();
    }
  }

  /**
   * Maneja las teclas especiales (backspace, arrow keys)
   */
  public onKeyDown(event: KeyboardEvent, index: number): void {

    //     if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
    //       const prevInput = this.otpInputs.toArray()[index - 1];
    //       if (prevInput) {
    //         this.otpDigits[index - 1] = '';
    //         prevInput.setFocus();
    //       }
    //     }
    if (event.key === 'Backspace') {
      if (!this.otpDigits[index] && index > 0) {
        // Si el campo actual está vacío, ir al anterior
        this.focusPrevious(index - 1);
      } else {
        // Limpiar el campo actual
        this.otpDigits[index] = '';
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focusPrevious(index - 1);
    } else if (event.key === 'ArrowRight' && index < this.MAX_OTP_LENGTH - 1) {
      this.focusNext(index + 1);
    }
  }

  /**
 * Maneja la opcion de pegar codigo completo
 */
  public onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text') || '';
    const digits = paste.replace(/\D/g, '').slice(0, this.MAX_OTP_LENGTH);

    for (let i = 0; i < digits.length && i < this.MAX_OTP_LENGTH; i++) {
      this.otpDigits[i] = digits[i];
    }

    if (digits.length >= this.MAX_OTP_LENGTH) {
      this.verifyOtp();
    } else if (digits.length > 0) {
      const lastIndex = Math.min(digits.length, this.MAX_OTP_LENGTH - 1);
      const lastInput = this.otpInputs.toArray()[lastIndex];
      if (lastInput) {
        setTimeout(() => lastInput.setFocus(), 10);
      }
    }
  }

  /**
   * Enfoca el siguiente input
   */
  private focusNext(index: number): void {
    setTimeout(() => {
      const inputs = this.otpInputs.toArray();
      if (inputs[index]) {
        inputs[index].setFocus();
      }
    }, 50);
  }

  /**
   * Enfoca el input anterior
   */
  private focusPrevious(index: number): void {
    setTimeout(() => {
      const inputs = this.otpInputs.toArray();
      if (inputs[index]) {
        inputs[index].setFocus();
      }
    }, 50);
  }

  /**
   * Verifica si el OTP está completo
   */
  private isOtpComplete(): boolean {
    return this.otpDigits.every(digit => digit !== '');
  }

  /**
   * Valida el OTP completo
   */
  private validateOtp(): void {
    if (this.isOtpComplete()) {
      const otpCode = this.otpDigits.join('');
      this.otpComplete.emit(otpCode);
    }
  }

  /**
   * Reenvía el código OTP
   */
  public resendCode(): void {
    if (this.canResend && !this.isLoading) {
      this.isLoading = true;
      this.clearOtp();
      this.startTimer();
      this.otpResend.emit();
      this.resendOtp();

      // Simular delay de reenvío
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    }
  }

  /**
   * Limpia todos los inputs del OTP
   */
  public clearOtp(): void {
    this.otpDigits = new Array(this.MAX_OTP_LENGTH).fill('');
    this.focusNext(0);
  }

  /**
   * Obtiene el valor actual del OTP
   */
  public getOtpValue(): string {
    return this.otpDigits.join('');
  }

  /**
   * Establece un valor de OTP programáticamente
   */
  public setOtpValue(value: string): void {
    const digits = value.slice(0, this.MAX_OTP_LENGTH).split('');
    this.otpDigits = new Array(this.MAX_OTP_LENGTH).fill('');

    digits.forEach((digit, index) => {
      if (index < this.MAX_OTP_LENGTH) {
        this.otpDigits[index] = digit;
      }
    });
  }

  /**
   * Getter para el número máximo de dígitos (readonly)
   */
  get maxOtpLength(): number {
    return this.MAX_OTP_LENGTH;
  }

  async verifyOtp() {
    if (!this.isOtpComplete()) {
      this.showAlert('Error', 'Por favor ingresa todos los dígitos del código OTP');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Verificando código...',
      spinner: 'crescent'
    });

    await loading.present();

    try {

      const otpCode = this.getOtpCode();
      const isValid = await this.validateOtpWithServer(otpCode);

      await loading.dismiss();

      if (isValid) {
        this.showAlert('Éxito', 'Código verificado correctamente', () => {
          this.router.navigate(['/']);
        });
      } else {
        this.showAlert('Error', 'Código incorrecto. Intenta nuevamente.');
        this.clearOtp();
      }
    } catch (error) {
      await loading.dismiss();
      this.showAlert('Error', 'Error al verificar el código. Intenta nuevamente.');
    }
  }

  private async showAlert(header: string, message: string, callback?: () => void) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'OK',
        handler: callback
      }]
    });
    await alert.present();
  }

  getOtpCode(): string {
    return this.otpDigits.join('');
  }

  private validateOtpWithServer(otpCode: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(otpCode === '12345');
      }, 2000);
    });
  }

  async resendOtp() {
    // if (this.timeLeft > 0) {
    //   return;
    // }

    const loading = await this.loadingController.create({
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
}