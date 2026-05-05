import os
import sys

def create_skill_structure(base_path, skill_name):
    """Cria a estrutura de pastas de uma skill."""
    skill_dir = os.path.join(base_path, ".agents", "skills", skill_name)
    subdirs = ["scripts", "examples", "resources"]
    
    try:
        os.makedirs(skill_dir, exist_ok=True)
        for subdir in subdirs:
            os.makedirs(os.path.join(skill_dir, subdir), exist_ok=True)
        
        print(f"✅ Estrutura da skill '{skill_name}' criada em: {skill_dir}")
        return skill_dir
    except Exception as e:
        print(f"❌ Erro ao criar estrutura: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso: python gerador_skill.py <caminho_base> <nome_da_skill>")
        sys.exit(1)
        
    base_path = sys.argv[1]
    skill_name = sys.argv[2]
    create_skill_structure(base_path, skill_name)
