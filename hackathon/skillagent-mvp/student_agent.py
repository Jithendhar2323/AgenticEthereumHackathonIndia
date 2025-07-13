import os
from langchain_community.chat_models import ChatOpenAI
from langchain.agents import initialize_agent, AgentType
from langchain.tools import Tool
import os

# Set your OpenAI API Key (replace with your actual key or load from environment)
os.environ["OPENAI_API_KEY"] = "sk-..."  # TODO: Replace with your OpenAI API key

# Initialize the LLM
llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo")  # Or "gpt-4" if available

# Add at least one dummy tool (echo tool)
def echo_tool(input_text: str) -> str:
    return f"Echo: {input_text}"

tools = [
    Tool(
        name="EchoTool",
        func=echo_tool,
        description="Echoes the input text."
    )
]

# Create the agent
agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# Example interaction
if __name__ == "__main__":
    question = "What are the best ways to learn Python for a beginner?"
    response = agent.run(question)
    print("Agent response:", response)
