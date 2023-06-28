import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InfluencerService } from 'src/app/influencer/services/influencer.service';
import { mergeMap, switchMap } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HotToastService } from '@ngneat/hot-toast';


export function emailMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.get('email')?.value;
    const confirmarEmail = control.get('confirmarEmail')?.value;

    if (email && confirmarEmail && email !== confirmarEmail) {
      return {
        emailDontMatch: true
      }
    }
    return null;
  }
}
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const senha = control.get('senha')?.value;
    const confirmarSenha = control.get('confirmarSenha')?.value;

    if (senha && confirmarSenha && senha !== confirmarSenha) {
      return {
        passwordDontMatch: true
      }
    }
    return null;
  }
}
@Component({
  selector: 'signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {

  registerConfirm: boolean = false;

  constructor(private toast: HotToastService, private fb: FormBuilder, private authService: AuthService, private influencerService: InfluencerService, private router: Router, private title: Title) { }

  ngOnInit(): void {
    this.title.setTitle("DigitalFavela - Cadastro");
  }
  adress: boolean = false;
  generos: string[] = ['Homem Cisgênero', 'Mulher Cisgênero', 'Homem Trans', 'Mulher Trans', 'Não-binário', 'Outros']
  etnias: string[] = ['Branco', 'Negro', 'Pardo', 'Indígina', 'Amarelo', 'Outro']
  categoriasInstagram: string[] = ['Turismo', 'Moda', 'Beleza', 'Maquiagem', 'Skin care', 'Games', 'Literatura', 'Educação', 'Empreendedorismo', 'Cultura', 'Música', 'Culinária', 'Política', 'Questões Raciais', 'Comportamento', 'Sexualidade', 'Body Positive', 'Autoestima', 'Decoração', 'Diy - Faça você mesmo', 'Ciência', 'Saúde', 'Tecnologia', 'Humor', 'Entreterimento', 'Artesanato', 'Viagem', 'Negócios', 'Maternidade', 'Paternidade', 'Artes', 'Bem-estar', 'Drinks', 'Bebidas', 'Feminismo', 'Esportes', 'Carros', 'Donas de casa', 'Alimentação saudável', 'Veganismo', 'Pets']
  estados: string[] = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO']

  formRegistro: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    confirmarEmail: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(6)]],
    confirmarSenha: ['', [Validators.required, Validators.minLength(6)]],
    dataNascimento: ['', [Validators.required, Validators.minLength(10)]],
    telefone: ['', [Validators.required, Validators.minLength(15)]],
    cpf: ['', [Validators.required, Validators.minLength(14)]],
    cep: ['', [Validators.required, Validators.minLength(10)]],
    cidade: ['', [Validators.required]],
    estado: ['', [Validators.required]],
    endereco: ['', Validators.required],
    numero: [''],
    complemento: [''],
    indigena: ['', Validators.required],
    nomeComunidade: ['', Validators.required],
    genero: ['', Validators.required],
    etnia: ['', Validators.required],
    categoriasInstagram: ['', Validators.required],
    categoriasInstagram2: [''],
    categoriasInstagram3: [''],
    cadastroFinalizado: ['false'],
    termosServico: ['', Validators.requiredTrue]
  }, { validators: [emailMatchValidator(), passwordMatchValidator()] })

  disableAdress() {
    this.adress = !this.adress
    if (this.adress) {
      this.formRegistro.controls['numero'].disable()
      this.formRegistro.controls['complemento'].disable()
    } else {
      this.formRegistro.controls['numero'].enable()
      this.formRegistro.controls['complemento'].enable()
    }
  }

  registerInfluencer() {
    this.registerConfirm = true;
    let influencer = this.formRegistro.value;
    const senha = this.formRegistro.value.senha;
    influencer.categoriasInstagram = [this.formRegistro.value.categoriasInstagram, this.formRegistro.value.categoriasInstagram2, this.formRegistro.value.categoriasInstagram3]
    delete influencer.categoriasInstagram2;
    delete influencer.categoriasInstagram3;
    delete influencer.confirmarEmail;
    delete influencer.confirmarSenha;
    this.influencerService.checkValidEmailAndCPF(influencer.cpf, influencer.email).subscribe(() => {
      this.authService.signUp(influencer.email, influencer.senha).pipe(
        mergeMap((res) => {
          return this.authService.signIn(influencer.email, influencer.senha)
        }), mergeMap((res) => {
          delete influencer.senha
          return this.influencerService.createInfluencer(influencer, res.user?.uid!)
        })).subscribe(() => {
          this.router.navigateByUrl('influencer/dashboard/redes')
        })
    },
      (res: HttpErrorResponse) => {
        this.registerConfirm = false;
        this.toast.error('Erro, CPF ou email já em uso')
      }
    )
  }
}
