"""Backward-compatibility re-export for legacy model imports.

New code should import models from `app.db.models`.
"""

from app.db.models import User

__all__ = ["User"]
