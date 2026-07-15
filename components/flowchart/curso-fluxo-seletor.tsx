"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCursos, useFluxos } from "@/hooks/use-grade";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";

interface CursoFluxoSeletorProps {
  cursoSlug: string | undefined;
  fluxoSlug: string | undefined;
  /** Chamado sempre que um par curso+fluxo válido fica definido/muda. */
  onChange: (cursoSlug: string, fluxoSlug: string) => void;
}

/**
 * Busca de curso (combobox com filtro de texto) + dropdown de fluxo,
 * usado tanto na home (escolher curso pela primeira vez) quanto na
 * página do fluxograma (trocar de curso/fluxo sem sair dela).
 *
 * Ao trocar de curso, seleciona automaticamente o fluxo mais recente
 * assim que a lista de fluxos daquele curso chega — refinar para um
 * fluxo mais antigo é feito depois, no próprio dropdown de fluxo.
 */
export function CursoFluxoSeletor({
  cursoSlug,
  fluxoSlug,
  onChange,
}: CursoFluxoSeletorProps) {
  const [open, setOpen] = useState(false);
  const { data: cursos, isLoading: cursosLoading } = useCursos();
  const { data: fluxos, isLoading: fluxosLoading } = useFluxos(cursoSlug);

  const cursoAtual = cursos?.find((c) => c.slug === cursoSlug);

  useEffect(() => {
    if (!cursoSlug || fluxosLoading || !fluxos || fluxos.length === 0) return;
    const fluxoValido = fluxos.some((f) => slugify(f.fluxo) === fluxoSlug);
    if (!fluxoValido) {
      onChange(cursoSlug, slugify(fluxos[0].fluxo));
    }
  }, [cursoSlug, fluxoSlug, fluxos, fluxosLoading, onChange]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal sm:w-[320px]"
          >
            <span className="truncate">
              {cursoAtual?.curso ??
                (cursosLoading ? "Carregando cursos..." : "Buscar curso...")}
            </span>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Buscar curso..." />
            <CommandList>
              <CommandEmpty>Nenhum curso encontrado.</CommandEmpty>
              <CommandGroup>
                {(cursos ?? []).map((c) => (
                  <CommandItem
                    key={c.slug}
                    value={c.curso}
                    onSelect={() => {
                      setOpen(false);
                      if (c.slug !== cursoSlug) onChange(c.slug, "");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        c.slug === cursoSlug ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {c.curso}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Select
        value={fluxoSlug || undefined}
        disabled={!cursoSlug || fluxosLoading || !fluxos?.length}
        onValueChange={(novoFluxoSlug) => {
          if (cursoSlug) onChange(cursoSlug, novoFluxoSlug);
        }}
      >
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="Fluxo" />
        </SelectTrigger>
        <SelectContent>
          {(fluxos ?? []).map((f) => (
            <SelectItem key={f.id} value={slugify(f.fluxo)}>
              {f.fluxo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
