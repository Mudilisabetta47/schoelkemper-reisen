import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="phero nf">
      <div className="container phero__inner">
        <p className="eyebrow">Seite nicht gefunden</p>
        <h1 className="h1">Hier hält kein Bus.</h1>
        <p className="lead">Die Seite gibt es nicht (mehr). Vielleicht ist die Reise schon vorbei – hier geht es weiter:</p>
        <div className="phero__actions">
          <ButtonLink href="/reisen" variant="primary">
            Aktuelle Reisen
          </ButtonLink>
          <ButtonLink href="/busanfrage" variant="outline">
            Bus anfragen
          </ButtonLink>
          <Link href="/" className="link-arrow">
            <span>Startseite</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
