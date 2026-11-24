import { formatPath } from '@documenso/lib/constants/app';
import { msg } from '@lingui/core/macro';
import { Trans, useLingui } from '@lingui/react/macro';
import {
  ArrowUpRightIcon,
  BoltIcon,
  CodeXmlIcon,
  CreditCardIcon,
  GitForkIcon,
  LayersIcon,
  Link2Icon,
  PlusIcon,
  ServerIcon,
  SignatureIcon,
  StoreIcon,
} from 'lucide-react';
import { Link } from 'react-router';

const SUPPORT_URL = 'https://docs.documenso.com/docs/policies/support';

export const LandingFaq = () => {
  const { i18n } = useLingui();

  return (
    <section id="faq" aria-labelledby="landing-faq-title" className="landing-content-section landing-faq">
      <div className="landing-section-heading">
        <h2 id="landing-faq-title">
          <Trans>Frequently asked questions</Trans>
        </h2>
        <p>
          <Trans>Find out how Documenso handles signing, data, integrations, and support.</Trans>
        </p>

        <div className="landing-support-card">
          <img
            src={formatPath('/landing/support-workspace.jpg')}
            alt=""
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
          />
          <div className="landing-support-content">
            <p>
              <Trans>Couldn't find your answer?</Trans>
            </p>
            <a href="https://documen.so/question-cta" className="landing-text-link">
              <Trans>Talk to us</Trans>
              <ArrowUpRightIcon aria-hidden="true" className="size-4 shrink-0" />
            </a>
          </div>
        </div>
      </div>

      <div className="landing-faq-list">
        {landingQuestions.map(({ question, answer, href, linkLabel }, index) => (
          <details key={question.id} name="landing-faq" open={index === 0} className="landing-faq-item">
            <summary>
              <span>{i18n._(question)}</span>
              <PlusIcon aria-hidden="true" className="landing-faq-icon size-5 shrink-0" />
            </summary>
            <div className="landing-faq-answer">
              <p>{i18n._(answer)}</p>
              <a href={href} className="landing-text-link mt-3">
                {i18n._(linkLabel)}
                <ArrowUpRightIcon aria-hidden="true" className="size-3.5 shrink-0" />
              </a>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
};

export const LandingBenefits = () => {
  const { i18n } = useLingui();

  return (
    <div className="landing-benefits-band">
      <section id="benefits" aria-labelledby="landing-benefits-title" className="landing-content-section">
        <div className="landing-section-heading">
          <h2 id="landing-benefits-title">
            <Trans>Why use Documenso?</Trans>
          </h2>
          <p>
            <Trans>Send agreements faster and choose how signing fits into your product or team.</Trans>
          </p>
        </div>

        <ul className="landing-benefits-grid">
          {landingBenefits.map(({ icon: Icon, title, description, isRoadmap }) => (
            <li key={title.id} className="landing-benefit">
              <div className="flex items-center justify-between gap-2.5">
                <span className="landing-benefit-icon">
                  <Icon aria-hidden="true" strokeWidth={1.45} className="size-10" />
                </span>
                {isRoadmap && (
                  <span className="landing-roadmap-label">
                    <Trans>Coming soon</Trans>
                  </span>
                )}
              </div>
              <h3>{i18n._(title)}</h3>
              <p>{i18n._(description)}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export const LandingClosingSection = ({ isSignupEnabled }: { isSignupEnabled: boolean }) => (
  <section aria-labelledby="landing-cta-title" className="landing-content-section landing-closing">
    <div className="landing-closing-card">
      <h2 id="landing-cta-title">
        <Trans>Ready to send your next agreement?</Trans>
      </h2>
      <p>
        <Trans>Set up digital signing for your team or build it into your own product.</Trans>
      </p>
      <Link to={isSignupEnabled ? '/signup' : '/signin'} className="landing-button landing-button-light">
        {isSignupEnabled ? <Trans>Get started</Trans> : <Trans>Sign in</Trans>}
        <ArrowUpRightIcon aria-hidden="true" className="size-4 shrink-0" />
      </Link>
    </div>
  </section>
);

const landingQuestions = [
  {
    question: msg`How secure is Documenso?`,
    answer: msg`Documenso digitally signs PDFs with certificates and records signing activity in an audit trail. You can also configure how recipients authenticate before accessing or signing a document.`,
    href: 'https://docs.documenso.com/docs/policies/security',
    linkLabel: msg`Read the security policy`,
  },
  {
    question: msg`How does Documenso protect personal data?`,
    answer: msg`You can review the hosted service’s data handling policies or self-host Documenso to control your infrastructure and storage. Your obligations depend on your deployment and how you use it.`,
    href: 'https://docs.documenso.com/docs/compliance/gdpr',
    linkLabel: msg`Learn about data protection`,
  },
  {
    question: msg`Can I connect Documenso to my other tools?`,
    answer: msg`Use the API, webhooks, embedded authoring and signing, or Zapier to connect Documenso to your workflow.`,
    href: '#integrations',
    linkLabel: msg`Explore integrations`,
  },
  {
    question: msg`Can I cancel a document after sending it?`,
    answer: msg`You can cancel a pending document from the workspace. This stops further signing and notifies recipients that the request was cancelled.`,
    href: 'https://docs.documenso.com/docs/users/documents/send',
    linkLabel: msg`Read the document sending guide`,
  },
  {
    question: msg`Where can I get support?`,
    answer: msg`Community support is available through GitHub and Discord. Hosted plans and enterprise licenses may include direct support.`,
    href: SUPPORT_URL,
    linkLabel: msg`See support options`,
  },
];

const landingBenefits = [
  {
    icon: BoltIcon,
    title: msg`Send agreements quickly`,
    description: msg`Upload a document, add recipients, and send it for signing in a few steps.`,
  },
  {
    icon: ServerIcon,
    title: msg`Host it your way`,
    description: msg`Run Documenso on your own infrastructure or use the hosted service.`,
  },
  {
    icon: SignatureIcon,
    title: msg`A clear signing experience`,
    description: msg`Give recipients a straightforward path from reviewing a document to signing it.`,
  },
  {
    icon: LayersIcon,
    title: msg`Reusable templates`,
    description: msg`Save frequently used documents, fields, and recipient roles so the next agreement is ready faster.`,
  },
  {
    icon: Link2Icon,
    title: msg`Share a signing link`,
    description: msg`Let people open and sign a reusable document from a direct link.`,
  },
  {
    icon: CodeXmlIcon,
    title: msg`Build on top`,
    description: msg`Use APIs, webhooks, and embeds to make signing part of your own product.`,
  },
  {
    icon: GitForkIcon,
    title: msg`Open source by design`,
    description: msg`Read the source, follow changes in public, and contribute to the project.`,
  },
  {
    icon: StoreIcon,
    title: msg`Template Store`,
    description: msg`A planned community store for finding and sharing document templates.`,
    isRoadmap: true,
  },
  {
    icon: CreditCardIcon,
    title: msg`Get paid`,
    description: msg`A planned Stripe integration for collecting payments alongside signing.`,
    isRoadmap: true,
  },
];
