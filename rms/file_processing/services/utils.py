from typing import ParamSpec, TypeVar, Callable

P = ParamSpec("P")
R = TypeVar("R")

F = Callable[P, R]


def on_error(return_value: R, catch: tuple[Exception, ...] = (Exception,)):
    def decorator(fn: F) -> F:
        def wrapper(*args: P.args, **kwargs: P.kwargs) -> R:
            try:
                return fn(*args, **kwargs)
            except catch as e:
                print(f"Error during {fn.__name__}'s execution. {e}")
                return return_value

        return wrapper

    return decorator
