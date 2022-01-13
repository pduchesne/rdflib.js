import {expect} from 'chai'
import {graph, Literal, serialize, st, sym, lit} from '../../src/index';


describe('serialize', () => {
    describe('doubles', () => {
        it('literal from double value is taken as-is', () => {
            const doc = sym("https://doc.example");
            const statement = st(
                sym('https://subject.example'),
                sym('https://predicate.example'),
                Literal.fromNumber(0.123),
                doc
            )
            const kb = graph();
            kb.add(statement)
            const result = serialize(doc, kb, null, 'text/turtle')
            expect(result).to.equal(`@prefix : <#>.

<https://subject.example> <https://predicate.example> 0.123 .

`)
        });

        it('literal from number ending with .0 serializes to integer', () => {
            const doc = sym("https://doc.example");
            const statement = st(
                sym('https://subject.example'),
                sym('https://predicate.example'),
                Literal.fromNumber(123.0),
                doc
            )
            const kb = graph();
            kb.add(statement)
            const result = serialize(doc, kb, null, 'text/turtle')
            expect(result).to.equal(`@prefix : <#>.

<https://subject.example> <https://predicate.example> 123 .

`)
        });

        it('appends e0 for strings typed as xsd:double', () => {
            const doc = sym("https://doc.example");
            const statement = st(
                sym('https://subject.example'),
                sym('https://predicate.example'),
                lit("0.123", undefined, sym("http://www.w3.org/2001/XMLSchema#double")),
                doc
            )
            const kb = graph();
            kb.add(statement)
            const result = serialize(doc, kb, null, 'text/turtle')
            expect(result).to.equal(`@prefix : <#>.

<https://subject.example> <https://predicate.example> 0.123e0 .

`)
        });

        it('adds .0 and e0 for strings containing an integer', () => {
            const doc = sym("https://doc.example");
            const statement = st(
                sym('https://subject.example'),
                sym('https://predicate.example'),
                lit("123", undefined, sym("http://www.w3.org/2001/XMLSchema#double")),
                doc
            )
            const kb = graph();
            kb.add(statement)
            const result = serialize(doc, kb, null, 'text/turtle')
            expect(result).to.equal(`@prefix : <#>.

<https://subject.example> <https://predicate.example> 123.0e0 .

`)
        });

        it('"e" notation is serialized as-is', () => {
            const doc = sym("https://doc.example");
            const statement = st(
                sym('https://subject.example'),
                sym('https://predicate.example'),
                lit("0.123e2", undefined, sym("http://www.w3.org/2001/XMLSchema#double")),
                doc
            )
            const kb = graph();
            kb.add(statement)
            const result = serialize(doc, kb, null, 'text/turtle')
            expect(result).to.equal(`@prefix : <#>.

<https://subject.example> <https://predicate.example> 0.123e2 .

`)
        });

        it('"e" notation with negative exponent is serialized as-is', () => {
            const doc = sym("https://doc.example");
            const statement = st(
                sym('https://subject.example'),
                sym('https://predicate.example'),
                lit("0.123e-2", undefined, sym("http://www.w3.org/2001/XMLSchema#double")),
                doc
            )
            const kb = graph();
            kb.add(statement)
            const result = serialize(doc, kb, null, 'text/turtle')
            expect(result).to.equal(`@prefix : <#>.

<https://subject.example> <https://predicate.example> 0.123e-2 .

`)
        });

        it('capital "E" is serialized as-is', () => {
            const doc = sym("https://doc.example");
            const statement = st(
                sym('https://subject.example'),
                sym('https://predicate.example'),
                lit("0.123E2", undefined, sym("http://www.w3.org/2001/XMLSchema#double")),
                doc
            )
            const kb = graph();
            kb.add(statement)
            const result = serialize(doc, kb, null, 'text/turtle')
            expect(result).to.equal(`@prefix : <#>.

<https://subject.example> <https://predicate.example> 0.123E2 .

`)
        });

        it('strings without dot but e notation are serialized as-is', () => {
            const doc = sym("https://doc.example");
            const statement = st(
                sym('https://subject.example'),
                sym('https://predicate.example'),
                lit("123e2", undefined, sym("http://www.w3.org/2001/XMLSchema#double")),
                doc
            )
            const kb = graph();
            kb.add(statement)
            const result = serialize(doc, kb, null, 'text/turtle')
            expect(result).to.equal(`@prefix : <#>.

<https://subject.example> <https://predicate.example> 123e2 .

`)
        });

        it('strings without dot but e notation with negative exponent are serialized as-is', () => {
            const doc = sym("https://doc.example");
            const statement = st(
                sym('https://subject.example'),
                sym('https://predicate.example'),
                lit("123e-2", undefined, sym("http://www.w3.org/2001/XMLSchema#double")),
                doc
            )
            const kb = graph();
            kb.add(statement)
            const result = serialize(doc, kb, null, 'text/turtle')
            expect(result).to.equal(`@prefix : <#>.

<https://subject.example> <https://predicate.example> 123e-2 .

`)
        });
    });


  describe('namespaces', () => {
    it('disable prefix make up', () => {
      const doc = sym("https://doc.example");
      const statement = st(
        sym('https://example.com/subject'),
        sym('http://schema.org/predicate'),
        sym('https://example.com/object/'),
        doc
      )
      const kb = graph();
      kb.setPrefixForURI("example", "https://example.com/")
      kb.setPrefixForURI("schema2", "http://schema.org/")
      kb.add(statement)

      const result = serialize(doc, kb, null, 'text/turtle', undefined, {flags: 'm'});

      expect(result).to.equal(`@prefix : <#>.
@prefix schema: <http://schema.org/>.
@prefix example: <https://example.com/>.

example:subject schema:predicate <https://example.com/object/>.

`)
    });
  });
});