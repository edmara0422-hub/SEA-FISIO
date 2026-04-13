export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#010101] text-white px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-[12px] font-bold mb-4">Politica de Privacidade — SEA Fisio</h1>
      <p className="text-[8px] text-white/40 mb-6">Ultima atualizacao: 13 de abril de 2026.</p>
      <div className="space-y-4 text-[8px] leading-relaxed text-white/60">
        <section>
          <h2 className="text-[9px] font-semibold text-white/80 mb-1">1. Dados que Coletamos</h2>
          <p>Coletamos apenas os dados necessarios para o funcionamento do app:</p>
          <ul className="list-disc pl-4 mt-1 space-y-0.5">
            <li>Dados de conta: nome, email, foto de perfil.</li>
            <li>Dados de uso: funcionalidades acessadas, tempo de uso, eventos de interacao (anonimizados).</li>
            <li>Dados clinicos do prontuario: armazenados localmente no dispositivo e sincronizados via Supabase com criptografia em transito.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-[9px] font-semibold text-white/80 mb-1">2. Como Usamos os Dados</h2>
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Autenticacao e gerenciamento de conta.</li>
            <li>Sincronizacao de dados entre dispositivos.</li>
            <li>Melhoria do app com base em analytics anonimizados.</li>
            <li>Envio de notificacoes sobre atualizacoes e recursos.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-[9px] font-semibold text-white/80 mb-1">3. Armazenamento e Seguranca</h2>
          <p>Os dados sao armazenados no Supabase (infraestrutura AWS) com criptografia em repouso e em transito (TLS 1.3). Dados clinicos do prontuario sao salvos localmente no dispositivo e sincronizados com autenticacao por token JWT.</p>
        </section>
        <section>
          <h2 className="text-[9px] font-semibold text-white/80 mb-1">4. Compartilhamento de Dados</h2>
          <p>NAO vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros. Dados de analytics sao agregados e anonimizados.</p>
        </section>
        <section>
          <h2 className="text-[9px] font-semibold text-white/80 mb-1">5. Seus Direitos (LGPD)</h2>
          <p>Conforme a Lei Geral de Protecao de Dados (Lei 13.709/2018), voce tem direito a:</p>
          <ul className="list-disc pl-4 mt-1 space-y-0.5">
            <li>Acessar seus dados pessoais.</li>
            <li>Corrigir dados incorretos ou incompletos.</li>
            <li>Solicitar a exclusao dos seus dados.</li>
            <li>Revogar o consentimento a qualquer momento.</li>
            <li>Solicitar a portabilidade dos dados.</li>
          </ul>
          <p className="mt-1">Para exercer seus direitos, entre em contato: edmararbusiness1@gmail.com</p>
        </section>
        <section>
          <h2 className="text-[9px] font-semibold text-white/80 mb-1">6. Exclusao de Conta</h2>
          <p>Voce pode excluir sua conta a qualquer momento pelo app (Perfil → Excluir minha conta). Ao excluir, todos os dados pessoais, prontuarios, historico e preferencias sao removidos permanentemente dos nossos servidores em ate 30 dias.</p>
        </section>
        <section>
          <h2 className="text-[9px] font-semibold text-white/80 mb-1">7. Cookies e Rastreamento</h2>
          <p>O app utiliza localStorage para manter a sessao e preferencias. Nao utilizamos cookies de terceiros para publicidade. Analytics sao processados internamente.</p>
        </section>
        <section>
          <h2 className="text-[9px] font-semibold text-white/80 mb-1">8. Menores de Idade</h2>
          <p>O app e destinado a profissionais de saude. Nao coletamos intencionalmente dados de menores de 18 anos.</p>
        </section>
        <section>
          <h2 className="text-[9px] font-semibold text-white/80 mb-1">9. Alteracoes nesta Politica</h2>
          <p>Podemos atualizar esta politica periodicamente. Notificaremos sobre mudancas significativas via app ou email.</p>
        </section>
        <section>
          <h2 className="text-[9px] font-semibold text-white/80 mb-1">10. Contato</h2>
          <p>Responsavel pelo tratamento de dados: Edmara Rocha.</p>
          <p>Email: edmararbusiness1@gmail.com</p>
        </section>
      </div>
    </div>
  )
}
