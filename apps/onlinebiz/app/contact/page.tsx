import { Metadata } from "next";
import Link from "next/link";
import { Mail, Shield, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Contacto — ZYPERIA OnlineBiz",
  description: "Entra em contacto connosco.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen px-4 py-20">
      <div className="container-narrow max-w-3xl">
        <span className="kicker mb-6">Contacto</span>
        <h1 className="h-display text-4xl md:text-6xl mb-8">Fala connosco.</h1>

        <div className="grid grid-cols-1 gap-4 mb-12">
          <a
            href="mailto:hi@zyperia.ai?subject=Geral"
            className="card p-6 flex items-start gap-4 hover:cursor-pointer"
          >
            <Mail className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <div className="h-display text-lg mb-1.5">Geral</div>
              <div className="text-sm text-[var(--text-secondary)]">hi@zyperia.ai</div>
              {/* TODO: trocar por feedback@zyperia.ai quando mailbox for criada */}
              <div className="text-xs text-[var(--text-muted)] mt-3 h-mono">
                Perguntas, feedback, correcções
              </div>
            </div>
          </a>

          <a
            href="mailto:hi@zyperia.ai?subject=Privacidade"
            className="card p-6 flex items-start gap-4 hover:cursor-pointer"
          >
            <Shield className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <div className="h-display text-lg mb-1.5">Privacidade</div>
              <div className="text-sm text-[var(--text-secondary)]">hi@zyperia.ai</div>
              {/* TODO: trocar por privacy@zyperia.ai quando mailbox for criada */}
              <div className="text-xs text-[var(--text-muted)] mt-3 h-mono">
                Pedidos GDPR, eliminação de dados
              </div>
            </div>
          </a>

          <a
            href="mailto:hi@zyperia.ai?subject=Transparencia"
            className="card p-6 flex items-start gap-4 hover:cursor-pointer"
          >
            <FileText className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <div className="h-display text-lg mb-1.5">Transparência</div>
              <div className="text-sm text-[var(--text-secondary)]">hi@zyperia.ai</div>
              {/* TODO: trocar por editorial@zyperia.ai quando mailbox for criada */}
              <div className="text-xs text-[var(--text-muted)] mt-3 h-mono">
                Divulgações, editorial
              </div>
            </div>
          </a>
        </div>

        <div className="prose-zyperia">
          <p>
            Escolhe o canal que combina com a tua mensagem. Lemos tudo; respondemos
            a quase tudo em 3 dias úteis. Se geres um negócio online e estás
            disposto a partilhar os números sem verniz para um caso de estudo,
            essa é a mensagem que mais queremos abrir.
          </p>

          <p className="text-sm text-[var(--text-muted)]">
            <strong>Imprensa &amp; parcerias:</strong> patrocínios de newsletter de
            negócios <em>não-curso</em> são possíveis. Colocação de casos de estudo
            e editorial pago não estão disponíveis — casos de estudo são escolhidos
            pelo mérito. Pitches: hi@zyperia.ai.
          </p>
        </div>
      </div>
    </div>
  );
}
