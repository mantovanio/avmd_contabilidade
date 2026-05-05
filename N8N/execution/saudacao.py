import os
from datetime import datetime

def saudar():
    hoje = datetime.now().strftime("%d/%m/%Y %H:%M")
    print("\n" + "="*50)
    print("🚀 DOE FRAMEWORK ATIVADO")
    print("="*50)
    print(f"Olá! Este é um exemplo de execução determinística.")
    print(f"Data/Hora atual: {hoje}")
    print("O Agente (Orchestration) leu a Diretriz e me chamou.")
    print("="*50 + "\n")

if __name__ == "__main__":
    saudar()
