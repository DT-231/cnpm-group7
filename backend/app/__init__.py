"""Backend application package.

This package follows a layered architecture with the following main modules:

- app.api:       FastAPI routers and dependencies
- app.core:      Configuration, security, and logging
- app.db:        SQLAlchemy models, base, and session
- app.schemas:   Pydantic models
- app.services:  Business logic services
- app.utils:     Utilities and custom exceptions
"""
